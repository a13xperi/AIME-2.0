import { useEffect, useState } from "react";
import { Cloud, Thermometer, Droplet, Wind, Clock, AlertTriangle, Compass, Eye, ChevronUp, ChevronDown, X } from "lucide-react";
import { WebRTCConnectionStatus } from "./AIRealtime";

interface WeatherData {
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

interface WeatherToolProps {
  events: any[];
  functionAdded: boolean;
  sendClientEvent: (event: any) => void;
  isSessionActive: boolean;
  connectionStatus: WebRTCConnectionStatus;
  weatherData?: WeatherData | null;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

// Helper function to convert wind direction in degrees to cardinal direction
function getWindDirection(degrees?: number): string {
  if (degrees === undefined) return "N/A";
  
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
}

// Helper function to format date
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  
  try {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (e) {
    return "";
  }
}

export default function WeatherToolPanel({
  isSessionActive,
  connectionStatus,
  weatherData,
  isExpanded = true,
  onToggle,
  onClose
}: WeatherToolProps) {
  // We're now just displaying data rather than handling function calls
  const isWeatherDataAvailable = weatherData && !weatherData.fetching && weatherData.location;
  const isFetching = weatherData?.fetching;
  const hasError = weatherData?.error;

  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud size={16} className="text-blue-500" />
          <h3 className="text-sm font-medium">Weather Tool</h3>
          {/* Status indicator circle instead of "Ready" text */}
          <div className={`w-2.5 h-2.5 rounded-full ${isSessionActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        </div>
        
        <div className="flex items-center">
          {onToggle && (
            <button 
              onClick={onToggle}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors mr-1"
              aria-label={isExpanded ? "Collapse weather panel" : "Expand weather panel"}
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          )}
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Remove weather panel"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
      
      {isExpanded ? (
        <>
          {!isSessionActive && (
            <p className="text-xs text-gray-500 mt-2">
              Start a session and ask about the weather to use this tool.
            </p>
          )}
          
          {isSessionActive && !isWeatherDataAvailable && !isFetching && (
            <p className="text-xs text-gray-500 mt-2">
              Ask about weather at any location - golf courses or cities worldwide.
            </p>
          )}
          
          {isFetching && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600">Fetching weather for {weatherData?.location}...</p>
              <div className="mt-1 flex justify-center">
                <div className="animate-spin h-3 w-3 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="mt-2 p-2 bg-red-50 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-red-500" />
                <p className="text-xs text-red-500">{weatherData?.error}</p>
              </div>
            </div>
          )}
          
          {isWeatherDataAvailable && !hasError && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm">{weatherData?.location}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={10} className="mr-1" />
                  {formatDate(weatherData?.timestamp)}
                </div>
              </div>
              
              {/* Temperature and Main Weather */}
              <div className="flex items-center gap-3 mt-2 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <Thermometer size={12} className="text-orange-500" />
                  <span className="text-sm font-medium">
                    {weatherData?.temperature}°{weatherData?.unit === 'fahrenheit' ? 'F' : 'C'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Cloud size={12} className="text-blue-400" />
                  <span className="text-sm capitalize">{weatherData?.description}</span>
                </div>
              </div>

              {/* Golf-specific Weather Data */}
              <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                {/* Wind Speed and Direction */}
                <div className="flex items-center gap-1">
                  <Wind size={12} className="text-blue-500" />
                  <span className="text-gray-700">
                    {weatherData?.windSpeed} mph
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Compass size={12} className="text-indigo-500" />
                  <span className="text-gray-700">
                    {getWindDirection(weatherData?.windDirection)} ({weatherData?.windDirection}°)
                  </span>
                </div>
                
                {/* Humidity and Cloud Cover */}
                <div className="flex items-center gap-1">
                  <Droplet size={12} className="text-cyan-500" />
                  <span className="text-gray-700">
                    {weatherData?.humidity}% humidity
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Cloud size={12} className="text-gray-500" />
                  <span className="text-gray-700">
                    {weatherData?.cloudCover}% cloud cover
                  </span>
                </div>
                
                {/* Visibility */}
                <div className="flex items-center gap-1 col-span-2">
                  <Eye size={12} className="text-gray-600" />
                  <span className="text-gray-700">
                    Visibility: {Math.round((weatherData?.visibility || 0) / 1609)} miles
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : isWeatherDataAvailable ? (
        // Show minimal info when collapsed but weather data is available
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <Thermometer size={12} className="text-orange-500" />
          <span>{weatherData?.temperature}°{weatherData?.unit === 'fahrenheit' ? 'F' : 'C'}</span>
          <span className="text-gray-300">|</span>
          <Wind size={12} className="text-blue-500" />
          <span>{weatherData?.windSpeed} mph</span>
        </div>
      ) : null}
    </div>
  );
} 