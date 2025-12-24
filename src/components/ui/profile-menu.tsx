import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from './avatar';
import { User, Settings, LogOut, HelpCircle, FileText, CreditCard } from 'lucide-react';

interface ProfileMenuProps {
  username?: string;
  onLogout?: () => void;
  onShowLogs?: () => void;
  onShowProfile?: () => void;
  onShowSettings?: () => void;
  onShowHelpSupport?: () => void;
  onShowSubscription?: () => void;
}

export function ProfileMenu({ 
  username, 
  onLogout, 
  onShowLogs,
  onShowProfile,
  onShowSettings,
  onShowHelpSupport,
  onShowSubscription
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get first letter of username for avatar
  const initials = username ? username.charAt(0).toUpperCase() : 'A';

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItem = (callback?: () => void) => {
    setIsOpen(false);
    if (callback) callback();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        aria-label="Profile menu"
      >
        <Avatar initials={initials} className="cursor-pointer" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            {username || 'admin'}
          </div>
          
          <button 
            onClick={() => handleMenuItem(onShowProfile)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </button>
          
          <button 
            onClick={() => handleMenuItem(onShowSettings)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>
          
          <button 
            onClick={() => handleMenuItem(onShowLogs)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileText className="mr-2 h-4 w-4" />
            View Logs
          </button>
          
          <button 
            onClick={() => handleMenuItem(onShowHelpSupport)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </button>
          
          <button 
            onClick={() => handleMenuItem(onShowSubscription)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </button>
          
          <div className="border-t border-gray-100">
            <button 
              onClick={() => handleMenuItem(onLogout)}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 