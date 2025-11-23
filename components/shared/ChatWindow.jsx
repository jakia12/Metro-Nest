'use client';
import { Bot, Minimize2, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ChatWindow({ onClose, onMinimize }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Emma, your real estate assistant. 👋 How can I help you find your dream home today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.reply }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Emma</h3>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
              {msg.role === 'user' ? (
                <User className="text-white" size={16} />
              ) : (
                <Bot className="text-gray-600" size={16} />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <Bot className="text-gray-600" size={16} />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-2">
          Powered by Google Gemini • Press Enter to send
        </p>
      </div>
    </div>
  );
}