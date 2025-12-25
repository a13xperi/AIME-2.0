import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { WebRTCConnectionStatus } from "./AIRealtime";

interface SessionControlsProps {
  isSessionActive: boolean;
  startSession: () => void;
  stopSession: () => void;
  sendTextMessage: (message: string) => void;
  connectionStatus: WebRTCConnectionStatus;
  aiResponding?: boolean;
}

interface SessionStoppedProps {
  startSession: () => void;
  connectionStatus: WebRTCConnectionStatus;
}

interface SessionActiveProps {
  stopSession: () => void;
  sendTextMessage: (message: string) => void;
  connectionStatus: WebRTCConnectionStatus;
  aiResponding?: boolean;
}

function SessionStopped({ startSession, connectionStatus }: SessionStoppedProps) {
  const isConnecting = connectionStatus === 'connecting';
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <button
        onClick={startSession}
        disabled={isConnecting}
        className={`
          w-36 h-36 rounded-full flex items-center justify-center text-white font-medium
          ${isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-green-600 hover:bg-green-700'}
          shadow-lg transition-all duration-300 transform hover:scale-105
          relative overflow-hidden
        `}
        style={{ 
          backgroundImage: 'radial-gradient(circle, #4ade80 0%, #16a34a 100%)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Golf ball dimple pattern - top layer */}
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `radial-gradient(circle at 15% 15%, rgba(255,255,255,0.3) 2px, transparent 2px), 
                              radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 55% 15%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 75% 45%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 85% 75%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 65% 65%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 25% 65%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 45% 85%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
            backgroundSize: '100% 100%'
          }}
        ></div>
        <span className="text-2xl">{isConnecting ? "..." : "Start"}</span>
      </button>
    </div>
  );
}

function SessionActive({ stopSession, sendTextMessage, connectionStatus, aiResponding }: SessionActiveProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const canSendMessage = connectionStatus === 'connected' && !isSending;
  
  function handleSendMessage() {
    if (!message.trim() || !canSendMessage) return;
    
    setIsSending(true);
    try {
      sendTextMessage(message);
      setMessage("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full relative">
      {/* Stop button - centered */}
      <div className="flex-1 flex justify-center items-center">
        <button 
          onClick={stopSession} 
          className={`
            w-28 h-28 rounded-full flex items-center justify-center text-white font-medium
            bg-red-500 hover:bg-red-600 
            shadow-lg transition-all duration-300 transform hover:scale-105
            ${aiResponding ? 'animate-pulse' : ''}
            relative overflow-hidden
          `}
          style={{ 
            backgroundImage: 'radial-gradient(circle, #f87171 0%, #dc2626 100%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Golf ball dimple pattern - top layer */}
          <div className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `radial-gradient(circle at 15% 15%, rgba(255,255,255,0.3) 2px, transparent 2px), 
                                radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 55% 15%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 75% 45%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 85% 75%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 65% 65%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 25% 65%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 45% 85%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
              backgroundSize: '100% 100%'
            }}
          ></div>
          <span className="text-xl">End</span>
        </button>
      </div>
      
      {/* Chat input - fixed at bottom */}
      <div className="w-full py-3 px-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim() && canSendMessage) {
                handleSendMessage();
              }
            }}
            type="text"
            placeholder="Speak or type to ask AIME..."
            className="flex-1 border border-gray-200 rounded-full py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!canSendMessage}
          />
          <button
            onClick={handleSendMessage}
            className={`rounded-full p-3 ${canSendMessage ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'} text-white`}
            disabled={!message.trim() || !canSendMessage}
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SessionControls({ isSessionActive, startSession, stopSession, sendTextMessage, connectionStatus, aiResponding }: SessionControlsProps) {
  return isSessionActive ? (
    <SessionActive stopSession={stopSession} sendTextMessage={sendTextMessage} connectionStatus={connectionStatus} aiResponding={aiResponding} />
  ) : (
    <SessionStopped startSession={startSession} connectionStatus={connectionStatus} />
  );
} 