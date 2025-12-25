import React from 'react';
import { PageView } from './page-view';
import { Volume2, Bell, Sun, Moon, Globe, Mic, Speaker } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  return (
    <PageView title="Settings" onBack={onBack}>
      <div className="max-w-lg mx-auto">
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-base font-medium mb-4">Voice & Audio</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="text-gray-400" size={20} />
                <div>
                  <p className="text-base">Voice Volume</p>
                  <p className="text-sm text-gray-500">Control the assistant voice volume</p>
                </div>
              </div>
              <input type="range" className="w-24" min="0" max="100" defaultValue="80" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Speaker className="text-gray-400" size={20} />
                <div>
                  <p className="text-base">Voice Type</p>
                  <p className="text-sm text-gray-500">Choose the AI assistant voice</p>
                </div>
              </div>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm">
                <option>Alloy</option>
                <option>Echo</option>
                <option>Nova</option>
                <option>Shimmer</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="text-gray-400" size={20} />
                <div>
                  <p className="text-base">Microphone Sensitivity</p>
                  <p className="text-sm text-gray-500">Adjust for environmental noise</p>
                </div>
              </div>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm" defaultValue="Medium (Default)">
                <option>High (Indoor)</option>
                <option>Medium (Default)</option>
                <option>Low (Outdoor)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-base font-medium mb-4">Display</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="text-gray-400" size={20} />
                <div>
                  <p className="text-base">Theme</p>
                  <p className="text-sm text-gray-500">Choose light or dark mode</p>
                </div>
              </div>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm" defaultValue="System">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-gray-400" size={20} />
                <div>
                  <p className="text-base">Language</p>
                  <p className="text-sm text-gray-500">Interface language</p>
                </div>
              </div>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm" defaultValue="English">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-base font-medium mb-4">Notifications</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-gray-400" size={20} />
                <div>
                  <p className="text-base">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts from the app</p>
                </div>
              </div>
              <div className="relative inline-block w-10 align-middle select-none">
                <input type="checkbox" name="toggle" id="toggle" className="opacity-0 absolute" defaultChecked />
                <label htmlFor="toggle" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                  <span className="block h-6 w-6 rounded-full bg-white transform translate-x-0 transition-transform duration-200 ease-in"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageView>
  );
} 