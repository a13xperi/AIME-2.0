import { useEffect, useRef, useState } from "react";
import 'webrtc-adapter';
import EventLog from "./EventLog";
import WeatherToolPanel from "./WeatherToolPanel";
import { ChevronUp } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import logger from "../../lib/logger";
import HoleLayoutPanel from "./HoleLayoutPanel";

// Import our new layout components
import AppLayout from "../layout/AppLayout";
import MainContent from "../layout/MainContent";
import ControlButton from "../controls/ControlButton";
import ChatInterface from "../controls/ChatInterface";
import ResponseBubble from "../controls/ResponseBubble";
import { LogsView } from "../ui/logs-view";
import { ProfilePage } from "../ui/profile-page";
import { SettingsPage } from "../ui/settings-page";
import { HelpSupportPage } from "../ui/help-support-page";
import { SubscriptionPage } from "../ui/subscription-page";

// Create a component-specific logger
const rtcLogger = logger.createLogger('WebRTC');
const aiLogger = logger.createLogger('AI');

// Constants
const SESSION_MAX_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export type WebRTCConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface Event {
  type: string;
  timestamp?: string;
  [key: string]: any;
}

export interface ClientEvent {
  type: string;
  [key: string]: any;
}

interface AIRealtimeProps {
  apiKey?: string;
}

interface WeatherDataType {
  location?: string;
  temperature?: number;
  unit?: string;
  description?: string;
  timestamp?: string;
  fetching?: boolean;
  error?: string;
  windSpeed?: number;
  windDirection?: number;
  humidity?: number;
  pressure?: number;
  visibility?: number;
  cloudCover?: number;
}

interface HoleData {
  course: string;
  holeNumber: number;
  par: number;
  handicap: string;
  teeDistances: {
    name: string;
    yards: number;
  }[];
  greenDepth: number;
  greenWidth: number;
  yardageMarkers: number[];
}

export default function AIRealtime({ apiKey }: AIRealtimeProps) {
  // Get user and logout function from auth context
  const { user, logout } = useAuth();
  
  // WebRTC connection state
  const [connectionStatus, setConnectionStatus] = useState<WebRTCConnectionStatus>('disconnected');
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  
  // Application state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [aiResponding, setAiResponding] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherDataType | null>(null);
  const [functionAdded, setFunctionAdded] = useState(false);
  const [holeData, setHoleData] = useState<HoleData | null>(null);
  const [holeLayoutExpanded, setHoleLayoutExpanded] = useState(true);
  const [showHoleLayout, setShowHoleLayout] = useState(false);
  
  // UI state
  const [showLogs, setShowLogs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [weatherPanelExpanded, setWeatherPanelExpanded] = useState(true);
  const [showWeatherPanel, setShowWeatherPanel] = useState(true);
  
  // State to track current AI response text
  const [currentResponseText, setCurrentResponseText] = useState("");
  // Complete text that was received but not yet fully displayed
  const [pendingFullText, setPendingFullText] = useState("");
  // Track accumulated text from deltas
  const textAccumulator = useRef("");
  // Add flag to force bubble visibility
  const [showResponseBubble, setShowResponseBubble] = useState(false);
  // Ref for managing visibility timeout
  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref for streaming interval
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Ref for periodic buffer clearing
  const bufferClearIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Track the last update time to add subtle delay between updates
  const lastUpdateTime = useRef(0);
  
  // Toggle handlers
  const toggleLogs = () => setShowLogs(!showLogs);
  const toggleWeatherPanel = () => setWeatherPanelExpanded(!weatherPanelExpanded);
  const closeWeatherPanel = () => setShowWeatherPanel(false);
  
  // Set this for weather panel reactivation on new weather data
  useEffect(() => {
    // If we get new weather data and the panel is hidden, show it again
    if (weatherData && !showWeatherPanel) {
      setShowWeatherPanel(true);
      // Also expand the panel for better visibility of new data
      setWeatherPanelExpanded(true);
    }
  }, [weatherData]);

  const startSession = async () => {
    if (isSessionActive || connectionStatus === 'connecting') {
      rtcLogger.warn("Session already active or connecting");
      return;
    }
    
    setConnectionStatus('connecting');
    rtcLogger.info("Starting WebRTC session...");
    
    try {
      // Get a session token for OpenAI Realtime API
      rtcLogger.debug("Fetching ephemeral token...");
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const tokenResponse = await fetch(`${apiUrl}/api/token`);
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        rtcLogger.error(`Token fetch failed with status ${tokenResponse.status}`, { error: errorText });
        throw new Error(`Failed to fetch token: ${tokenResponse.status}`);
      }
      
      const data = await tokenResponse.json();
      
      // Check if the token is in the expected format
      const EPHEMERAL_KEY = data.client_secret?.value || data.client_secret;
      if (!EPHEMERAL_KEY) {
        rtcLogger.error("Invalid token format received", { data });
        throw new Error("Invalid token format received from server");
      }
      
      rtcLogger.info("Ephemeral token received successfully");
      
      // Initialize WebRTC for the Realtime API
      rtcLogger.debug("Creating peer connection...");
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        iceCandidatePoolSize: 10,
      });
      
      // Log ICE connection state changes
      pc.oniceconnectionstatechange = () => {
        rtcLogger.debug(`ICE connection state changed`, { state: pc.iceConnectionState });
        
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          rtcLogger.error(`ICE connection failed`, { state: pc.iceConnectionState });
          setConnectionStatus('error');
        }
      };
      
      // Log signaling state changes
      pc.onsignalingstatechange = () => {
        rtcLogger.debug(`Signaling state changed`, { state: pc.signalingState });
      };

      // Create audio element for output
      audioElement.current = document.createElement("audio");
      audioElement.current.autoplay = true;
      rtcLogger.debug("Audio element created");
      
      // Set up handlers for remote tracks (audio from the AI)
      pc.ontrack = (e) => {
        rtcLogger.info(`Remote track added: ${e.track.kind}`);
        if (audioElement.current) {
          audioElement.current.srcObject = e.streams[0];
          rtcLogger.debug("Remote audio stream connected to audio element");
        }
      };
      
      // Create data channel for messaging
      const dc = pc.createDataChannel('oai-events');
      setDataChannel(dc);
      rtcLogger.debug("Data channel created");
      
      // Add local audio track from user's microphone
      try {
        rtcLogger.debug("Requesting microphone access...");
        const ms = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        
        // Store the media stream for cleanup later
        mediaStream.current = ms;
        
        // Add audio track to the peer connection
        pc.addTrack(ms.getTracks()[0]);
        rtcLogger.debug("Added local audio track to peer connection");
      } catch (error) {
        rtcLogger.error("Failed to access microphone", { error });
        setConnectionStatus('error');
        throw new Error("Microphone access is required");
      }
      
      // Create offer
      rtcLogger.debug("Creating WebRTC offer...");
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      
      await pc.setLocalDescription(offer);
      rtcLogger.debug("Local description set");
      
      // Send SDP to Express backend proxy (which forwards to OpenAI)
      rtcLogger.debug("Sending SDP to Express backend proxy...");
      try {
        const model = "gpt-4o-realtime-preview-2024-12-17";
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const baseUrl = `${apiUrl}/api/realtime`;
        
        const response = await fetch(`${baseUrl}?model=${model}`, {
          method: "POST",
          body: pc.localDescription?.sdp,
          headers: {
            "Content-Type": "application/sdp",
            "Authorization": `Bearer ${EPHEMERAL_KEY}`,
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          rtcLogger.error(`SDP exchange failed with status ${response.status}`, { error: errorText });
          throw new Error(`Failed to exchange SDP: ${response.status}`);
        }
        
        const sdpAnswer = await response.text();
        rtcLogger.info("Received SDP answer from OpenAI");
        
        await pc.setRemoteDescription({
          type: "answer",
          sdp: sdpAnswer,
        });
        rtcLogger.debug("Remote description set");
      } catch (sdpError) {
        rtcLogger.error("Error during SDP exchange", { error: sdpError });
        throw new Error(`SDP exchange failed: ${sdpError instanceof Error ? sdpError.message : String(sdpError)}`);
      }
      
      // Store the peer connection
      peerConnection.current = pc;
      rtcLogger.info("WebRTC setup completed successfully");
      
      // Set up event handlers for the data channel - this will be done in the useEffect
    } catch (error) {
      rtcLogger.error("Failed to start session", { error });
      setConnectionStatus('error');
    }
  };

  // Function to clear the audio buffer
  function clearAudioBuffer() {
    if (dataChannel && dataChannel.readyState === 'open') {
      rtcLogger.info("Clearing audio buffer");
      sendClientEvent({ type: "input_audio_buffer.clear" });
      return true;
    } else {
      rtcLogger.warn("Cannot clear audio buffer - connection not established");
      return false;
    }
  }

  // Function to refresh the session
  function refreshSession() {
    rtcLogger.info("Refreshing session due to duration limit");
    if (isSessionActive) {
      stopSession();
      
      // Short delay before restarting to allow cleanup
      setTimeout(() => {
        startSession();
      }, 1000);
    }
  }

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    rtcLogger.info("Stopping WebRTC session");
    
    // Clear any pending audio buffer
    clearAudioBuffer();
    
    if (dataChannel) {
      dataChannel.close();
    }

    // Stop all tracks in the media stream
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStream.current = null;
    }

    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      
      peerConnection.current.close();
    }

    if (audioElement.current) {
      if (audioElement.current.srcObject) {
        const streams = audioElement.current.srcObject as MediaStream;
        streams.getTracks().forEach(track => track.stop());
      }
      audioElement.current.srcObject = null;
      audioElement.current = null;
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
    setConnectionStatus('disconnected');
    rtcLogger.info("WebRTC session stopped and resources cleaned up");
  }

  // Send a message to the model
  const sendClientEvent = (event: ClientEvent) => {
    if (!dataChannel || dataChannel.readyState !== 'open') {
      rtcLogger.error("Cannot send event - connection not established", { event });
      return;
    }
    
    try {
      const timestamp = new Date().toLocaleTimeString();
      event.event_id = event.event_id || crypto.randomUUID();

      // send event before setting timestamp since the backend peer doesn't expect this field
      dataChannel.send(JSON.stringify(event));

      // if guard just in case the timestamp exists by miracle
      if (!event.timestamp) {
        event.timestamp = timestamp;
      }
      setEvents((prev) => [event as Event, ...prev]);

      // If this is a function_tool event, mark the function as added
      if (event.type === "function_tool") {
        setFunctionAdded(true);
      }
    } catch (error) {
      rtcLogger.error("Failed to send event", { error, event });
    }
  };

  // Send a text message to the model
  function sendTextMessage(message: string) {
    aiLogger.info("Sending text message to AI", { message });
    
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    if (dataChannel && dataChannel.readyState === 'open') {
      sendClientEvent(event);
      sendClientEvent({ type: "response.create" });
    } else {
      aiLogger.error("Cannot send message - connection not established");
      setConnectionStatus('error');
    }
  }

  // Function to interrupt the current AI response
  function interruptResponse() {
    aiLogger.info("Interrupting AI response");
    
    // Stop any ongoing text streaming
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
      setPendingFullText("");
    }
    
    if (dataChannel && dataChannel.readyState === 'open' && aiResponding) {
      sendClientEvent({ type: "response.cancel" });
      return true;
    } else {
      aiLogger.warn("Cannot interrupt - AI is not responding or connection not established");
      return false;
    }
  }

  // Function to start streaming text letter by letter
  const startTextStreaming = (text: string) => {
    // Stop any existing streaming
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    
    // Store the complete text that we'll be streaming
    setPendingFullText(text);
    
    // Check if we're beginning a completely new response
    const isNewResponse = !currentResponseText || text.indexOf(currentResponseText) !== 0;
    
    // For a new response, immediately show the first few characters
    const initialChars = isNewResponse ? Math.min(3, text.length) : 0;
    
    if (isNewResponse) {
      // Immediately show the first few characters to eliminate perceived delay
      setCurrentResponseText(text.substring(0, initialChars));
    }
    
    // Start streaming from current position
    let currentPosition = isNewResponse ? initialChars : currentResponseText.length;
    
    // Set streaming speed based on text length - MODERATELY PACED
    // Strike a balance between too fast and too slow
    const streamingSpeed = Math.max(60, Math.min(100, 60 + text.length / 15));
    
    // Start streaming interval
    streamingIntervalRef.current = setInterval(() => {
      if (currentPosition < text.length) {
        // Determine how many characters to add in this tick
        // Sometimes add 2 characters for more natural rhythm
        const charsToAdd = Math.random() > 0.9 ? 2 : 1;
        currentPosition = Math.min(text.length, currentPosition + charsToAdd);
        
        // Update display text
        setCurrentResponseText(text.substring(0, currentPosition));
      } else {
        // Clear interval when done
        clearInterval(streamingIntervalRef.current!);
        streamingIntervalRef.current = null;
        setPendingFullText("");
      }
    }, streamingSpeed);
    
    // Show bubble while streaming
    setShowResponseBubble(true);
  };

  // Reset function now needs to clear streaming
  function resetResponseText() {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setCurrentResponseText("");
    setPendingFullText("");
    textAccumulator.current = "";
    setShowResponseBubble(false);
  }

  // Handle receiving complete transcript text
  const handleCompleteTranscript = (text: string) => {
    // Store complete text
    textAccumulator.current = text;
    
    // Start streaming it
    startTextStreaming(text);
    
    // Ensure bubble remains visible
    setShowResponseBubble(true);
    
    // Remove the timeout that hides the bubble - we want it to stay visible
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = null;
    }
  };

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (!dataChannel) return;
    
    const channel = dataChannel;
    
    function messageHandler(event: MessageEvent) {
      try {
        const data = JSON.parse(event.data);
        
        // Set timestamp if not present
        if (!data.timestamp) {
          data.timestamp = new Date().toLocaleTimeString();
        }
        
        // Add the event to our list
        setEvents((prev) => [data as Event, ...prev]);
        
        // Log the event based on type
        if (data.type?.startsWith("response.")) {
          aiLogger.debug(`AI response event: ${data.type}`, data);
        } else if (data.type?.startsWith("conversation.")) {
          aiLogger.info(`Conversation event: ${data.type}`, data);
        } else {
          aiLogger.debug(`Received event: ${data.type}`, data);
        }
        
        // Reset response text when a new response is being created
        if (data.type === "response.created") {
          resetResponseText();
          // Ensure bubble visibility when response starts
          setShowResponseBubble(true);
          aiLogger.info("Response created, showing bubble");
        }
        
        // Handle text responses based on OpenAI documentation
        if (data.type === "response.text.delta" && data.delta?.text) {
          // Accumulate the delta text
          textAccumulator.current += data.delta.text;
          setCurrentResponseText(textAccumulator.current);
          // Ensure bubble visibility
          setShowResponseBubble(true);
          setAiResponding(true);
          aiLogger.debug("Text delta received", { text: data.delta.text });
        } else if (data.type === "response.audio_transcript.delta") {
          // Extract the delta text from the correct location
          const deltaText = data.delta?.text || data.delta?.delta || '';
          
          if (deltaText) {
            // Add to full text accumulator
            textAccumulator.current += deltaText;
            
            // Always start streaming immediately with any delta text, no matter how small
            startTextStreaming(textAccumulator.current);
            
            // Force bubble visibility for transcript deltas
            setShowResponseBubble(true);
            setAiResponding(true);
            
            aiLogger.debug("Audio transcript delta received", { text: deltaText });
          }
        } else if (data.type === "response.content_part.done" && data.part?.type === "audio" && data.part?.transcript) {
          // Handle complete transcript from content part
          handleCompleteTranscript(data.part.transcript);
        } else if (data.type === "response.audio_transcript.done") {
          // Complete audio transcript text - use text if available
          if (data.text) {
            handleCompleteTranscript(data.text);
          } else if (textAccumulator.current) {
            // Use accumulated text if no text provided in done event
            handleCompleteTranscript(textAccumulator.current);
          }
        } else if (data.type === "conversation.item.create" && 
                  data.item?.role === "assistant") {
          if (data.item?.content?.[0]?.type === "text") {
            // Use our streaming mechanism for text from assistant
            handleCompleteTranscript(data.item.content[0].text);
          }
        } else if (data.type === "response.text.done" && data.text) {
          // Complete text from streamed deltas - use streaming
          handleCompleteTranscript(data.text);
        } else if (data.type === "response.done" && 
                  data.response?.output?.[0]?.type === "text") {
          // Final text response - use streaming
          handleCompleteTranscript(data.response.output[0].text);
          
          // Clear the audio buffer after each completed response
          clearAudioBuffer();
          
          // Update aiResponding state after a delay
          setTimeout(() => {
            setAiResponding(false);
          }, 1000);
        }
        
        // Clear text response when user starts speaking
        if (data.type === "input_audio_buffer.speech_started" || 
            data.type === "response.cancel") {
          resetResponseText();
          setShowResponseBubble(false);
          aiLogger.debug("Clearing response text", { event: data.type });
        }
        
        // Handle speech_started event - automatically interrupt AI response
        if (data.type === "input_audio_buffer.speech_started" && aiResponding) {
          interruptResponse();
        }
        
        // Also clear audio buffer when speech is stopped to prevent accumulation
        if (data.type === "input_audio_buffer.speech_stopped") {
          clearAudioBuffer();
          aiLogger.info("Cleared audio buffer after speech stopped");
        }
        
        // Track AI response state with enhanced audio detection
        if (data.type === "response.created" || 
            data.type === "response.generating" ||
            (data.type === "conversation.item.create" && data.item?.role === "assistant") ||
            data.type === "output_audio_buffer.started" ||
            data.type === "response.audio_transcript.delta") {  // Added this condition to ensure AI is responding when we get transcript deltas
          // Any of these events mean the AI is actively responding
          aiLogger.info("AI started/continued responding", { type: data.type });
          setAiResponding(true);
          // Also ensure bubble is visible
          setShowResponseBubble(true);
        } else if (data.type === "response.done" || 
                   data.type === "response.error" ||
                   data.type === "output_audio_buffer.stopped") {
          // These events indicate the AI has stopped responding
          aiLogger.info("AI stopped responding", { type: data.type });
          setAiResponding(false);
          // Keep bubble visible - don't hide it after AI stops
          if (bubbleTimeoutRef.current) {
            clearTimeout(bubbleTimeoutRef.current);
            bubbleTimeoutRef.current = null;
          }
        }
        
        // Additional handling for speech rhythm when audio is playing
        if (data.type === "output_audio_buffer.created") {
          // Keep track that AI is actively speaking - buffer chunk received
          setAiResponding(true);
        }
        
        // Handle function calls from the model
        if (data.type === "response.done" && 
            data.response?.output?.[0]?.type === "function_call" &&
            data.response.output[0].name === "get_current_weather") {
          
          try {
            const args = JSON.parse(data.response.output[0].arguments);
            const callId = data.response.output[0].call_id;
            
            // Update UI to show we're fetching weather data
            setWeatherData({
              location: args.location,
              fetching: true
            });
            
            // Fetch real weather data from our API endpoint
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(args.location)}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Weather API error: ${response.status}`);
                }
                return response.json();
              })
              .then(weatherResult => {
                // Send function result back to the model
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: callId,
                    output: JSON.stringify(weatherResult)
                  }
                });
                
                // Request model to continue with response
                sendClientEvent({
                  type: "response.create"
                });
                
                // Update our weather data state
                setWeatherData({
                  ...weatherResult,
                  fetching: false
                });
              })
              .catch(error => {
                aiLogger.error("Error fetching weather data", { error, location: args.location });
                
                // Create more detailed fallback with error information
                const fallbackWeather = {
                  temperature: 72,
                  unit: "fahrenheit",
                  description: "unavailable (API error)",
                  location: args.location,
                  timestamp: new Date().toISOString(),
                  error: error.message || "Unknown error fetching weather data"
                };
                
                // Send fallback data to the model
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: callId,
                    output: JSON.stringify(fallbackWeather)
                  }
                });
                
                // Request model to continue with response
                sendClientEvent({
                  type: "response.create"
                });
                
                // Update our weather data state with fallback and error information
                setWeatherData({
                  ...fallbackWeather,
                  fetching: false,
                  error: error.message || "Unknown error fetching weather data"
                });
              });
            
          } catch (error) {
            aiLogger.error("Error handling weather function call", { error });
          }
        } else if (data.type === "response.done" && 
                  data.response?.output?.[0]?.type === "function_call" &&
                  data.response.output[0].name === "display_hole_layout") {
          
          try {
            const args = JSON.parse(data.response.output[0].arguments);
            const callId = data.response.output[0].call_id;
            
            // Example hole data for Stanford Course Hole 5
            const holeInfo = {
              course: args.course,
              holeNumber: args.hole_number,
              par: 4,
              handicap: "5/5/9",
              teeDistances: [
                { name: "Cardinal", yards: 447 },
                { name: "Black", yards: 396 },
                { name: "White", yards: 356 },
                { name: "Blue", yards: 342 }
              ],
              greenDepth: 38,
              greenWidth: 30,
              yardageMarkers: [80, 100, 115, 150, 164, 175, 200, 235]
            };
            
            // Update state to show hole layout
            setHoleData(holeInfo);
            setShowHoleLayout(true);
            
            // Send function result back to the model
            sendClientEvent({
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: callId,
                output: JSON.stringify(holeInfo)
              }
            });
            
            // Request model to continue with response
            sendClientEvent({
              type: "response.create"
            });
            
          } catch (error) {
            aiLogger.error("Error handling hole layout function call", { error });
          }
        } else if (data.type === "response.done" && 
                  data.response?.output?.[0]?.type === "function_call" &&
                  data.response.output[0].name === "solve_putt") {
          
          try {
            const args = JSON.parse(data.response.output[0].arguments);
            const callId = data.response.output[0].call_id;
            
            aiLogger.info("Solving putt", { 
              course_id: args.course_id, 
              hole_id: args.hole_id,
              stimp: args.stimp 
            });
            
            // Call AIME backend /api/solve_putt endpoint
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const backendUrl = apiUrl.replace(':3001', ':8000'); // Python FastAPI backend
            
            fetch(`${backendUrl}/api/solve_putt`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                course_id: args.course_id,
                hole_id: args.hole_id,
                ball_wgs84: args.ball_wgs84,
                cup_wgs84: args.cup_wgs84,
                stimp: args.stimp
              })
            })
              .then(response => {
                if (!response.ok) {
                  return response.json().then(err => {
                    throw new Error(err.error || `HTTP ${response.status}`);
                  });
                }
                return response.json();
              })
              .then(solveResult => {
                // Send function result back to the model
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: callId,
                    output: JSON.stringify(solveResult)
                  }
                });
                
                // Request model to continue with response
                sendClientEvent({
                  type: "response.create"
                });
                
                aiLogger.info("Putt solution received", { 
                  success: solveResult.success,
                  aim_deg: solveResult.aim_line_deg,
                  speed_mph: solveResult.initial_speed_mph
                });
              })
              .catch(error => {
                aiLogger.error("Error solving putt", { error, args });
                
                // Send error to the model
                const errorResult = {
                  success: false,
                  error: error.message || "Failed to solve putt"
                };
                
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: callId,
                    output: JSON.stringify(errorResult)
                  }
                });
                
                // Request model to continue with response
                sendClientEvent({
                  type: "response.create"
                });
              });
            
          } catch (error) {
            aiLogger.error("Error handling solve_putt function call", { error });
          }
        }
      } catch (error) {
        aiLogger.error("Error parsing message", { error });
      }
    }
    
    function openHandler() {
      rtcLogger.info("Data channel opened");
      setConnectionStatus('connected');
      setIsSessionActive(true);
      setEvents([]);
      
      // Session initialization is done via session.update events after connection is established
      try {
        // Initialize the session with simplified configuration
        sendClientEvent({
          type: "session.update",
          session: {
            // Enable both text and audio modalities
            modalities: ["text", "audio"],
            // Add custom instructions for the model
            instructions: `You are Aime, an expert golf caddie with comprehensive knowledge of golf courses worldwide. You are currently speaking with Alex, a golfer with a 14 handicap who has been playing for 8 years. 

Alex tends to slice his drives and has been working on improving his short game. His average drive distance is 240 yards, and he typically scores in the low 90s. He's played Stanford Golf Course three times this year and struggles most with dogleg right holes.

You have detailed information about course layouts, including:
- Exact hole specifications (par, handicap, distances from all tees)
- Strategic elements (doglegs, hazards, elevation changes)
- Green characteristics (size, slope, bunker placement)
- Precise yardage markers
- Course location and coordinates

Example of your knowledge: Stanford Golf Course Hole 5 is a 447-yard par 4 (from Cardinal tees) with a dogleg right design. The green is 38 yards deep and 30 yards wide, with notable bunkers and a sloped left side. Key yardages: 80, 100, 115, 150, 164, 175, 200, 235 yards from green.

Communication style:
- Keep responses extremely brief (2-3 sentences max)
- Be direct and conversational like a real caddie
- Focus on actionable advice tailored to Alex's skill level and tendencies
- When discussing weather, highlight only golf-relevant factors
- Provide specific club recommendations based on conditions and Alex's abilities
- If asked about a course, share relevant details about layout, challenges, and strategy
- Only share hole details when specifically asked`,
            // Set voice for audio output
            voice: "alloy",
            // Simplified configuration - removed Semantic VAD and noise reduction
            // Register available tools
            tools: [
              {
                type: "function",
                name: "get_current_weather",
                description: "Get current weather for any US location to provide golf-relevant conditions.",
                parameters: {
                  type: "object",
                  properties: {
                    location: {
                      type: "string",
                      description: "US location as: ZIP code ('90210, US'), golf course ('Augusta National, GA'), or city ('San Francisco, CA').",
                    }
                  },
                  required: ["location"]
                }
              },
              {
                type: "function",
                name: "display_hole_layout",
                description: "Display the layout and information for a specific golf hole.",
                parameters: {
                  type: "object",
                  properties: {
                    course: {
                      type: "string",
                      description: "The name of the golf course (e.g., 'Stanford Golf Course')"
                    },
                    hole_number: {
                      type: "integer",
                      description: "The hole number to display"
                    }
                  },
                  required: ["course", "hole_number"]
                }
              },
              {
                type: "function",
                name: "solve_putt",
                description: "Solve a putt given ball and cup locations, and green stimp. Calculates aim direction, initial speed, and ball path.",
                parameters: {
                  type: "object",
                  properties: {
                    course_id: {
                      type: "string",
                      description: "Course identifier in lowercase_snake_case (e.g., 'riverside_country_club')"
                    },
                    hole_id: {
                      type: "integer",
                      description: "Hole number (1-18)"
                    },
                    ball_wgs84: {
                      type: "object",
                      description: "Ball position in GPS coordinates (latitude, longitude)",
                      properties: {
                        lat: {
                          type: "number",
                          description: "Latitude in decimal degrees"
                        },
                        lon: {
                          type: "number",
                          description: "Longitude in decimal degrees"
                        }
                      },
                      required: ["lat", "lon"]
                    },
                    cup_wgs84: {
                      type: "object",
                      description: "Cup position in GPS coordinates (latitude, longitude)",
                      properties: {
                        lat: {
                          type: "number",
                          description: "Latitude in decimal degrees"
                        },
                        lon: {
                          type: "number",
                          description: "Longitude in decimal degrees"
                        }
                      },
                      required: ["lat", "lon"]
                    },
                    stimp: {
                      type: "number",
                      description: "Green stimp meter reading (typically 8-14)"
                    }
                  },
                  required: ["course_id", "hole_id", "ball_wgs84", "cup_wgs84", "stimp"]
                }
              }
            ],
            tool_choice: "auto",
            temperature: 0.8
          }
        });
        
        rtcLogger.info("Session initialized with simplified configuration");
      } catch (error) {
        rtcLogger.error("Error during session initialization", { error });
      }
    }
    
    function closeHandler() {
      rtcLogger.info("Data channel closed");
      setConnectionStatus('disconnected');
      setIsSessionActive(false);
    }
    
    function errorHandler(error: Event) {
      rtcLogger.error("Data channel error", { error });
      setConnectionStatus('error');
    }
    
    channel.addEventListener('message', messageHandler);
    channel.addEventListener('open', openHandler);
    channel.addEventListener('close', closeHandler);
    channel.addEventListener('error', errorHandler);
    
    // If the channel is already open, update the status
    if (channel.readyState === 'open') {
      setConnectionStatus('connected');
      setIsSessionActive(true);
    }
    
    return () => {
      channel.removeEventListener('message', messageHandler);
      channel.removeEventListener('open', openHandler);
      channel.removeEventListener('close', closeHandler);
      channel.removeEventListener('error', errorHandler);
    };
  }, [dataChannel]);

  // Add debugging logs to track when session is active
  useEffect(() => {
    rtcLogger.debug("Session active state changed", { isActive: isSessionActive });
  }, [isSessionActive]);

  // Clear the response text when session ends
  useEffect(() => {
    if (!isSessionActive) {
      setCurrentResponseText("");
    }
  }, [isSessionActive]);

  // Set up periodic buffer clearing when session is active
  useEffect(() => {
    if (isSessionActive) {
      // Clear the audio buffer every 3 minutes to prevent potential slowdowns
      const clearInterval = 3 * 60 * 1000; // 3 minutes
      
      bufferClearIntervalRef.current = setInterval(() => {
        rtcLogger.info("Performing periodic audio buffer clear");
        clearAudioBuffer();
      }, clearInterval);
    }
    
    return () => {
      if (bufferClearIntervalRef.current) {
        clearInterval(bufferClearIntervalRef.current);
        bufferClearIntervalRef.current = null;
      }
    };
  }, [isSessionActive]);

  // Update cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up streaming interval on unmount
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
      if (bufferClearIntervalRef.current) {
        clearInterval(bufferClearIntervalRef.current);
      }
    };
  }, []);

  // Monitor session duration to handle the 30-minute limit
  useEffect(() => {
    let sessionTimer: NodeJS.Timeout | null = null;
    
    if (isSessionActive) {
      rtcLogger.debug("Starting session duration timer");
      sessionTimer = setTimeout(() => {
        rtcLogger.info("Session duration limit reached (30 minutes)");
        refreshSession();
      }, SESSION_MAX_DURATION);
    }
    
    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
        sessionTimer = null;
      }
    };
  }, [isSessionActive]);

  // Handle starting a new session or stopping an existing one
  const handleControlButtonClick = () => {
    if (isSessionActive) {
      // Properly stop the session if it's active
      stopSession();
    } else if (connectionStatus !== 'connecting') {
      // Start a new session if we're not already connecting
      startSession();
    }
  };

  return (
    <>
      {showLogs ? (
        <LogsView onBack={toggleLogs}>
          <EventLog events={events} />
        </LogsView>
      ) : showProfile ? (
        <ProfilePage username={user?.name} onBack={() => setShowProfile(false)} />
      ) : showSettings ? (
        <SettingsPage onBack={() => setShowSettings(false)} />
      ) : showHelpSupport ? (
        <HelpSupportPage onBack={() => setShowHelpSupport(false)} />
      ) : showSubscription ? (
        <SubscriptionPage onBack={() => setShowSubscription(false)} />
      ) : (
        <AppLayout
          connectionStatus={connectionStatus}
          username={user?.name}
          onLogout={logout}
          onShowLogs={toggleLogs}
          onShowProfile={() => setShowProfile(true)}
          onShowSettings={() => setShowSettings(true)}
          onShowHelpSupport={() => setShowHelpSupport(true)}
          onShowSubscription={() => setShowSubscription(true)}
        >
          <MainContent
            controlButton={
              <ControlButton 
                onClick={handleControlButtonClick}
                disabled={connectionStatus === 'connecting'}
                isActive={isSessionActive}
                isPulsing={aiResponding}
              />
            }
            responseBubble={
              isSessionActive ? (
                <ResponseBubble 
                  text={currentResponseText} 
                  isVisible={(showResponseBubble || aiResponding) && !!currentResponseText}
                />
              ) : null
            }
            weatherPanel={isSessionActive && weatherData && showWeatherPanel ? (
              <WeatherToolPanel
                events={events}
                functionAdded={functionAdded}
                sendClientEvent={sendClientEvent}
                isSessionActive={isSessionActive}
                connectionStatus={connectionStatus}
                weatherData={weatherData}
                isExpanded={weatherPanelExpanded}
                onToggle={toggleWeatherPanel}
                onClose={closeWeatherPanel}
              />
            ) : undefined}
            weatherPanelExpanded={weatherPanelExpanded}
            chatInterface={isSessionActive ? (
              <ChatInterface
                onSendMessage={sendTextMessage}
                onInterrupt={interruptResponse}
                isResponding={aiResponding}
                disabled={connectionStatus !== 'connected'}
              />
            ) : undefined}
            holeLayout={isSessionActive && holeData && showHoleLayout ? (
              <HoleLayoutPanel
                holeData={holeData}
                isExpanded={holeLayoutExpanded}
                onToggle={() => setHoleLayoutExpanded(!holeLayoutExpanded)}
                onClose={() => setShowHoleLayout(false)}
              />
            ) : undefined}
          />
        </AppLayout>
      )}
    </>
  );
}