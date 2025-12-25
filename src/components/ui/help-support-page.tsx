import React from 'react';
import { PageView } from './page-view';
import { HelpCircle, Mail, MessageCircle, Book, ExternalLink } from 'lucide-react';

interface HelpSupportPageProps {
  onBack: () => void;
}

export function HelpSupportPage({ onBack }: HelpSupportPageProps) {
  return (
    <PageView title="Help & Support" onBack={onBack}>
      <div className="max-w-lg mx-auto">
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-base font-medium mb-4">Frequently Asked Questions</h4>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <button className="flex items-center justify-between w-full text-left">
                <p className="text-base font-medium">What is AIME?</p>
                <HelpCircle className="text-gray-400" size={18} />
              </button>
              <div className="mt-2 text-sm text-gray-600">
                <p>AIME is your AI golf assistant that provides real-time weather information, answers questions about golf, and helps improve your game through personalized advice.</p>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <button className="flex items-center justify-between w-full text-left">
                <p className="text-base font-medium">How does voice interaction work?</p>
                <HelpCircle className="text-gray-400" size={18} />
              </button>
              <div className="mt-2 text-sm text-gray-600">
                <p>Simply tap the microphone button to start a session, then speak your question. AIME will respond via voice and text. You can interrupt AIME at any time by tapping the button again.</p>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <button className="flex items-center justify-between w-full text-left">
                <p className="text-base font-medium">How accurate is the weather information?</p>
                <HelpCircle className="text-gray-400" size={18} />
              </button>
              <div className="mt-2 text-sm text-gray-600">
                <p>AIME provides up-to-date weather information from reliable weather services. For golf courses and specific locations, simply ask about the weather at that location.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-base font-medium mb-4">Contact Support</h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-base">Email Support</p>
                <p className="text-sm text-gray-500">support@aimegolf.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MessageCircle className="text-gray-400" size={20} />
              <div>
                <p className="text-base">Live Chat</p>
                <p className="text-sm text-gray-500">Available 9am-5pm EST</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-base font-medium mb-4">Resources</h4>
          
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-3 text-blue-600">
              <Book className="text-gray-400" size={20} />
              <span>User Guide</span>
              <ExternalLink size={14} />
            </a>
            
            <a href="#" className="flex items-center gap-3 text-blue-600">
              <HelpCircle className="text-gray-400" size={20} />
              <span>Tutorial Videos</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </PageView>
  );
} 