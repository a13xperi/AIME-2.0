import React from 'react';
import { PageView } from './page-view';
import { Check, Star, Award, Zap } from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
}

export function SubscriptionPage({ onBack }: SubscriptionPageProps) {
  return (
    <PageView title="Subscription" onBack={onBack}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-medium mb-2">Choose Your Plan</h3>
          <p className="text-gray-500">Upgrade to unlock premium features and enhanced capabilities</p>
        </div>
        
        {/* Free Plan */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-base font-medium">Free Plan</h4>
              <p className="text-sm text-gray-500">Basic features for casual users</p>
            </div>
            <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              Current
            </div>
          </div>
          
          <div className="mb-4">
            <span className="text-2xl font-bold">Free</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Basic golf assistant features</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Current weather conditions</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Limited voice sessions</span>
            </div>
          </div>
          
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-medium transition-colors">
            Current Plan
          </button>
        </div>
        
        {/* Pro Plan */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-green-200 relative">
          <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-base font-medium flex items-center">
                Pro Plan <Star size={16} className="text-amber-400 ml-1" />
              </h4>
              <p className="text-sm text-gray-500">Enhanced features for golf enthusiasts</p>
            </div>
          </div>
          
          <div className="mb-4">
            <span className="text-2xl font-bold">Pro</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">All Free features</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Unlimited voice sessions</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Advanced golf tips and insights</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Weather forecasts for golf planning</span>
            </div>
          </div>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors">
            Upgrade to Pro
          </button>
        </div>
        
        {/* Premium Plan */}
        <div className="bg-gray-50 rounded-lg p-6 border border-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-base font-medium flex items-center">
                Premium Plan <Award size={16} className="text-blue-500 ml-1" />
              </h4>
              <p className="text-sm text-gray-500">Ultimate experience for serious golfers</p>
            </div>
          </div>
          
          <div className="mb-4">
            <span className="text-2xl font-bold">Premium</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">All Pro features</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Priority response times</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Personal golf swing analysis</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Course-specific tips and recommendations</span>
            </div>
            <div className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
              <span className="text-sm">Early access to new features</span>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </PageView>
  );
} 