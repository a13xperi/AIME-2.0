import React from 'react';
import { PageView } from './page-view';
import { User, Mail, Phone } from 'lucide-react';

interface ProfilePageProps {
  username?: string;
  onBack: () => void;
}

export function ProfilePage({ username = 'User', onBack }: ProfilePageProps) {
  return (
    <PageView title="Profile" onBack={onBack}>
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-3xl font-medium mb-4">
            {username.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-medium">{username}</h3>
          <p className="text-gray-500">Golf Enthusiast</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-base font-medium mb-4">Personal Information</h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base">{username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base">user@example.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base">(555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-base font-medium mb-4">Golf Preferences</h4>
          <p className="text-base text-gray-500 italic">
            Placeholder: Account preferences and golf-specific settings would appear here
          </p>
        </div>
      </div>
    </PageView>
  );
} 