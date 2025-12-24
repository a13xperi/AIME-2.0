import React, { ReactNode } from 'react';
import Header from './Header';
import { WebRTCConnectionStatus } from '../airealtime/AIRealtime';

interface AppLayoutProps {
  children: ReactNode;
  username?: string;
  connectionStatus?: WebRTCConnectionStatus;
  onLogout?: () => void;
  onShowLogs?: () => void;
  onShowProfile?: () => void;
  onShowSettings?: () => void;
  onShowHelpSupport?: () => void;
  onShowSubscription?: () => void;
}

export default function AppLayout({
  username,
  connectionStatus = 'disconnected',
  children,
  onLogout,
  onShowLogs,
  onShowProfile,
  onShowSettings,
  onShowHelpSupport,
  onShowSubscription
}: AppLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with connection status and profile menu */}
      <Header 
        username={username} 
        connectionStatus={connectionStatus} 
        onLogout={onLogout}
        onShowLogs={onShowLogs}
        onShowProfile={onShowProfile}
        onShowSettings={onShowSettings}
        onShowHelpSupport={onShowHelpSupport}
        onShowSubscription={onShowSubscription}
      />
      
      {/* Main content area - takes all available space */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
} 