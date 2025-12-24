import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive: boolean;
  isPulsing?: boolean;
}

export default function ControlButton({ 
  onClick, 
  disabled = false, 
  isActive, 
  isPulsing = false 
}: ControlButtonProps) {
  // Add state to track button press for animation
  const [isShaking, setIsShaking] = useState(false);
  
  // Handle button click with animation
  const handleClick = () => {
    if (disabled) return;
    
    // Only play the shake animation when starting a session (not when ending)
    if (!isActive) {
      setIsShaking(true);
      // Remove animation class after it completes
      setTimeout(() => setIsShaking(false), 500);
    }
    
    onClick();
  };
  
  // Same light gradient for both states
  const bgGradient = 'radial-gradient(circle, #f9fafb 0%, #d1d5db 100%)';
  
  // Get animation classes based on state
  const getAnimationClasses = () => {
    if (isShaking) return 'btn-shake';
    if (!isActive) {
      // Ready state when inactive (showing microphone)
      return disabled ? '' : 'btn-ready';
    }
    // Active state - always apply a subtle animation when active, stronger when AI is speaking
    return isPulsing ? 'ai-speaking' : 'active-session-pulse';
  };
  
  // Get border classes based on state
  const getBorderClasses = () => {
    if (!isActive) return 'border-4 border-gray-300';
    if (isPulsing) return 'border-4 ai-speaking-border';
    return 'border-4 border-green-300'; // Green border when session is active
  };
  
  // Get icon classes based on state
  const getIconClasses = () => {
    // Base classes depend on state - grey when inactive, green when active
    const baseClasses = isActive ? 'text-green-500' : 'text-gray-400';
    
    if (isActive && isPulsing) return `${baseClasses} ai-speaking-icon`;
    // Add continuous animation for active session, more noticeable when AI is speaking
    if (isActive) return `${baseClasses} active-icon-pulse`;
    // Add more noticeable effect for the microphone icon when inactive
    if (!isActive && !disabled) return `${baseClasses} icon-ready`;
    return baseClasses;
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-36 h-36 rounded-full flex items-center justify-center font-medium
        bg-gray-100 hover:bg-gray-200 text-gray-700
        shadow-lg transition-all duration-300 transform hover:scale-105
        ${isPulsing && !isActive ? 'animate-pulse' : ''}
        ${getAnimationClasses()}
        relative overflow-hidden ${getBorderClasses()}
      `}
      style={{ 
        backgroundImage: bgGradient,
        boxShadow: !isActive && !disabled 
          ? '0 4px 8px rgba(100, 116, 139, 0.1)' 
          : isActive 
            ? '0 4px 12px rgba(74, 222, 128, 0.3)' 
            : '0 4px 8px rgba(0, 0, 0, 0.15)'
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
      
      {/* More subtle glow effect for the ready state */}
      {!isActive && !disabled && (
        <div 
          className="absolute inset-0 rounded-full opacity-5 hover:opacity-10 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.2) 0%, transparent 70%)'
          }}
        ></div>
      )}
      
      {/* Active session glow effect */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-full opacity-20 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.3) 0%, transparent 70%)'
          }}
        ></div>
      )}
      
      {isActive ? (
        disabled ? (
          <span className="text-2xl">...</span>
        ) : (
          <Mic size={36} className={getIconClasses()} />
        )
      ) : (
        <MicOff size={36} className={getIconClasses()} />
      )}
    </button>
  );
} 