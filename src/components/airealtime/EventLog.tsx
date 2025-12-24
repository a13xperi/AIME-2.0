import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import { Event } from "./AIRealtime";
import logger, { LogEvent } from "../../lib/logger";

interface EventLogProps {
  events: Event[];
}

// Combined event type for both WebRTC events and logger events
type CombinedEvent = {
  id: string;
  timestamp: string;
  type: string;
  source?: string;
  level?: string;
  details?: any;
  originalEvent: Event | LogEvent;
  isLogEvent: boolean;
};

function EventItem({ event }: { event: CombinedEvent }) {
  const [expanded, setExpanded] = useState(false);
  
  // Extract a readable title from the event
  const getEventTitle = () => {
    if (event.isLogEvent) {
      // This is a logger event
      const logEvent = event.originalEvent as LogEvent;
      return logEvent.message;
    } else {
      // This is a WebRTC event
      const rtcEvent = event.originalEvent as Event;
      
      if (rtcEvent.type.includes("audio")) {
        return `Audio ${rtcEvent.type.split("_").pop()}`;
      } else if (rtcEvent.type === "response.done") {
        const message = rtcEvent.response?.output?.[0]?.content?.[0]?.transcript || 
                      rtcEvent.response?.output?.[0]?.content?.[0]?.text || 
                      "Response complete";
        return message.length > 60 ? message.substring(0, 60) + "..." : message;
      } else if (rtcEvent.type === "function_call") {
        return `Function: ${rtcEvent.function_name || "Unknown function"}`;
      } else if (rtcEvent.type === "function_response") {
        return "Function response";
      } else {
        return rtcEvent.type;
      }
    }
  };

  // Get appropriate background color based on event type or log level
  const getBgColor = () => {
    if (event.isLogEvent) {
      switch (event.level) {
        case 'error': return 'bg-red-50';
        case 'warn': return 'bg-yellow-50';
        case 'info': return 'bg-blue-50';
        case 'debug': return 'bg-gray-50';
        default: return 'bg-gray-50';
      }
    } else {
      if (event.type.includes('error')) {
        return 'bg-red-50';
      } else if (event.type === 'response.done') {
        return 'bg-green-50';
      } else if (event.type.startsWith('response.')) {
        return 'bg-blue-50';
      } else {
        return 'bg-gray-50';
      }
    }
  };

  return (
    <div className="border border-gray-100 rounded-md overflow-hidden mb-2">
      <div 
        className={`flex items-center justify-between p-2 ${getBgColor()} cursor-pointer hover:bg-opacity-80`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {expanded ? 
            <ChevronDown className="text-gray-500 w-4 h-4 mr-2" /> : 
            <ChevronRight className="text-gray-500 w-4 h-4 mr-2" />
          }
          <span className="text-sm font-medium text-gray-700">{getEventTitle()}</span>
        </div>
        <div className="flex items-center space-x-2">
          {event.source && (
            <span className="text-xs bg-gray-200 px-1 py-0.5 rounded">{event.source}</span>
          )}
          {event.level && (
            <span className={`text-xs px-1 py-0.5 rounded ${
              event.level === 'error' ? 'bg-red-200' :
              event.level === 'warn' ? 'bg-yellow-200' :
              event.level === 'info' ? 'bg-blue-200' :
              'bg-gray-200'
            }`}>{event.level.toUpperCase()}</span>
          )}
          <span className="text-xs text-gray-500">{event.timestamp}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="p-2 bg-white border-t border-gray-100">
          <pre className="text-xs text-gray-600 overflow-auto p-2 bg-gray-50 rounded">
            {JSON.stringify(event.originalEvent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function EventLog({ events }: EventLogProps) {
  const [combinedEvents, setCombinedEvents] = useState<CombinedEvent[]>([]);
  const [filters, setFilters] = useState({
    showWebRTC: true,
    showLogs: true,
    showDebug: true,
    showInfo: true,
    showWarn: true,
    showError: true,
  });
  
  // Subscribe to logger events
  useEffect(() => {
    const unsubscribe = logger.subscribe((logEvent) => {
      setCombinedEvents(prev => {
        const newEvent: CombinedEvent = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(logEvent.timestamp).toLocaleTimeString(),
          type: 'log',
          source: logEvent.source,
          level: logEvent.level,
          details: logEvent.details,
          originalEvent: logEvent,
          isLogEvent: true
        };
        
        return [newEvent, ...prev].slice(0, 500); // Keep only the most recent 500 events
      });
    });
    
    return unsubscribe;
  }, []);
  
  // Process WebRTC events when they change
  useEffect(() => {
    // Convert WebRTC events to our combined format
    const webRTCEvents: CombinedEvent[] = events.map(event => ({
      id: event.event_id || `webrtc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: event.timestamp || new Date().toLocaleTimeString(),
      type: event.type,
      source: 'WebRTC',
      details: event,
      originalEvent: event,
      isLogEvent: false
    }));
    
    // Update combined events, preserving logger events
    setCombinedEvents(prev => {
      // Keep only logger events
      const logEvents = prev.filter(event => event.isLogEvent);
      
      // Combine with new WebRTC events
      return [...webRTCEvents, ...logEvents]
        .sort((a, b) => {
          // Sort by timestamp, most recent first
          const timeA = new Date(a.timestamp);
          const timeB = new Date(b.timestamp);
          return timeB.getTime() - timeA.getTime();
        })
        .slice(0, 500); // Keep only the most recent 500 events
    });
  }, [events]);
  
  // Apply filters to events
  const filteredEvents = combinedEvents.filter(event => {
    if (event.isLogEvent) {
      if (!filters.showLogs) return false;
      
      // Filter by log level
      switch (event.level) {
        case 'debug': return filters.showDebug;
        case 'info': return filters.showInfo;
        case 'warn': return filters.showWarn;
        case 'error': return filters.showError;
        default: return true;
      }
    } else {
      return filters.showWebRTC;
    }
  });
  
  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  // Render filters
  const renderFilters = () => (
    <div className="flex flex-wrap gap-1 mb-2">
      <button 
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filters.showWebRTC ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleFilter('showWebRTC')}
      >
        WebRTC {!filters.showWebRTC && <X size={12} />}
      </button>
      <button 
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filters.showLogs ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleFilter('showLogs')}
      >
        Logs {!filters.showLogs && <X size={12} />}
      </button>
      <button 
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filters.showDebug ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleFilter('showDebug')}
      >
        Debug {!filters.showDebug && <X size={12} />}
      </button>
      <button 
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filters.showInfo ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleFilter('showInfo')}
      >
        Info {!filters.showInfo && <X size={12} />}
      </button>
      <button 
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filters.showWarn ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleFilter('showWarn')}
      >
        Warn {!filters.showWarn && <X size={12} />}
      </button>
      <button 
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filters.showError ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleFilter('showError')}
      >
        Error {!filters.showError && <X size={12} />}
      </button>
    </div>
  );

  if (filteredEvents.length === 0) {
    return (
      <div>
        {renderFilters()}
        <div className="flex items-center justify-center h-32 text-gray-500">
          No events match the current filters
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderFilters()}
      <div className="space-y-1">
        {filteredEvents.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
} 