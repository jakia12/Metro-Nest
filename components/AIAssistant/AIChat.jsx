'use client';

import { AlertCircle, Bot, MessageCircle, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your real estate AI assistant. 🏠 I can help you find properties, answer questions about buying or renting, and guide you through the process. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message immediately
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6) // Send last 6 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant response
      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to contact our support team directly.",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickQuestions = [
    "Show me available properties",
    "What's the buying process?",
    "Tell me about mortgage rates",
    "I'm looking for a 3-bedroom home"
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#f05454] to-[#d94545] text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-[#f05454]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">AI Assistant</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-[450px] overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-[#f05454]' 
                      : msg.isError 
                        ? 'bg-red-100' 
                        : 'bg-white border-2 border-gray-200'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : msg.isError ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Bot className="w-4 h-4 text-[#f05454]" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[75%] rounded-2xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-[#f05454] text-white rounded-tr-sm'
                      : msg.isError
                        ? 'bg-red-50 text-red-900 rounded-tl-sm border border-red-200'
                        : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#f05454]" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Questions (only show at start) */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-500 font-medium px-1">Quick questions:</p>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(q)}
                      className="w-full text-left text-xs bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-2.5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f05454] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-[#f05454] text-white p-2.5 rounded-xl hover:bg-[#d94545] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Powered by AI • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#f05454] text-white rounded-full p-4 shadow-lg hover:bg-[#d94545] hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
            Need help?
          </span>
        </button>
      )}
    </>
  );
}
