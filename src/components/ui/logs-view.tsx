import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LogsViewProps {
  children: ReactNode;
  onBack: () => void;
}

export function LogsView({ children, onBack }: LogsViewProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="border-b border-gray-200 p-4 flex items-center">
        <button 
          onClick={onBack}
          className="p-1 mr-3 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-medium">Debug Logs</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
} 