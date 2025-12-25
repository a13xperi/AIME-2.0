import React, { useEffect, useState } from 'react';

interface ResponseBubbleProps {
  text: string;
  isVisible: boolean;
}

export default function ResponseBubble({ text, isVisible }: ResponseBubbleProps) {
  // State for blinking cursor
  const [showCursor, setShowCursor] = useState(true);
  
  // Create blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Early return if not visible or no text
  if (!isVisible || !text?.trim()) {
    return null;
  }
  
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-6 w-80 z-50">
      <div className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-lg shadow-sm text-sm animate-fadeIn mx-auto border border-gray-200 max-h-[40vh]">
        <p className="max-h-40 overflow-y-auto pr-1 whitespace-pre-wrap break-words text-sm">
          {text}
          <span className={`inline-block h-4 w-0.5 ml-0.5 ${showCursor ? 'bg-gray-500' : 'bg-transparent'} transition-colors duration-100`}></span>
        </p>
        {/* Bubble pointer */}
        <div className="absolute w-4 h-4 bg-white/90 transform rotate-45 left-1/2 -ml-2 -bottom-2 border-b border-r border-gray-200"></div>
      </div>
    </div>
  );
} 