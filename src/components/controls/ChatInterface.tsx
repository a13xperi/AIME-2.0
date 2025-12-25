import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  onInterrupt?: () => boolean;
  isResponding?: boolean;
  disabled?: boolean;
}

export default function ChatInterface({ 
  onSendMessage, 
  onInterrupt,
  isResponding = false,
  disabled = false 
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  
  function handleSendMessage() {
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage("");
  }
  
  // Determine if the button should be enabled
  const hasMessage = message.trim().length > 0;
  const isButtonEnabled = hasMessage && !disabled;
  
  return (
    <div className="flex items-center gap-2">
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter" && isButtonEnabled) {
            handleSendMessage();
          }
        }}
        type="text"
        placeholder="Speak or type to ask AIME..."
        className="flex-1 border border-gray-200 rounded-full py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <button
        onClick={handleSendMessage}
        className={`rounded-full p-3 transition-colors duration-200 ${
          isButtonEnabled 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-400'
        } text-white`}
        disabled={!isButtonEnabled}
      >
        <MessageSquare size={18} className={hasMessage ? 'text-white' : 'text-gray-200'} />
      </button>
    </div>
  );
} 