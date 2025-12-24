import React from 'react';
import { ProfileMenu } from '../ui/profile-menu';

interface HeaderProps {
  connectionStatus?: 'connected' | 'connecting' | 'error' | 'disconnected';
  username?: string;
  onLogout?: () => void;
  onShowLogs?: () => void;
  onShowProfile?: () => void;
  onShowSettings?: () => void;
  onShowHelpSupport?: () => void;
  onShowSubscription?: () => void;
}

export default function Header({ 
  connectionStatus = 'disconnected',
  username,
  onLogout,
  onShowLogs,
  onShowProfile,
  onShowSettings,
  onShowHelpSupport,
  onShowSubscription
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 py-3 px-4 flex justify-between items-center">
      {/* Logo and connection status */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 font-medium text-sm">
          A
        </div>
        
        {/* Connection status indicator */}
        <div 
          className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
          }`}
        ></div>
      </div>
      
      {/* Profile menu */}
      <ProfileMenu 
        username={username}
        onLogout={onLogout}
        onShowLogs={onShowLogs}
        onShowProfile={onShowProfile}
        onShowSettings={onShowSettings}
        onShowHelpSupport={onShowHelpSupport}
        onShowSubscription={onShowSubscription}
      />
    </header>
  );
} 