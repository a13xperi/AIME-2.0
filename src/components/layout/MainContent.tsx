import React, { ReactNode } from 'react';

interface MainContentProps {
  controlButton: ReactNode;
  responseBubble?: ReactNode;
  weatherPanel?: ReactNode;
  weatherPanelExpanded?: boolean;
  chatInterface?: ReactNode;
  holeLayout?: ReactNode;
}

export default function MainContent({ 
  controlButton, 
  responseBubble,
  weatherPanel, 
  weatherPanelExpanded = true,
  chatInterface,
  holeLayout
}: MainContentProps) {
  // Determine if we need extra vertical spacing based on weather panel visibility
  const hasWeatherPanel = !!weatherPanel;
  
  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Main control button - centered vertically */}
      <div className="flex-1 flex flex-col justify-center items-center h-full">
        {/* Control button with relative position to allow absolute positioning of bubble */}
        <div className="relative py-16">
          {responseBubble}
          {controlButton}
        </div>
      </div>
      
      {/* Weather panel - positioned absolutely at the bottom */}
      {weatherPanel && (
        <div className={`absolute bottom-16 left-0 right-0 w-full px-4 ${weatherPanelExpanded ? 'mb-2' : 'mb-0'}`}>
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            {weatherPanel}
          </div>
        </div>
      )}
      
      {/* Chat interface - fixed at bottom */}
      <div className="w-full py-3 px-3 bg-white border-t border-gray-100">
        {chatInterface || <div className="h-12"></div>}
      </div>
      
      {holeLayout && (
        <div className="absolute bottom-0 left-0 right-0 w-full">
          {holeLayout}
        </div>
      )}
    </div>
  );
} 