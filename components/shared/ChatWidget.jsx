'use client';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <ChatWindow 
            onClose={() => setIsOpen(false)}
            onMinimize={() => setIsMinimized(true)}
          />
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div 
          onClick={() => setIsMinimized(false)}
          className="mb-4 bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Emma is here to help</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsMinimized(false);
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Need help?
          </span>
        </button>
      )}
    </div>
  );
}