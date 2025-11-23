"use client";

import { MessageSquare, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function AgentMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/messages");
      const result = await response.json();
      if (result.success) {
        setConversations(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/agent/messages/${userId}`);
      const result = await response.json();
      if (result.success) {
        setMessages(result.data);
        // Update unread count locally
        setConversations((prev) =>
          prev.map((conv) =>
            conv.partner._id === userId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch(`/api/agent/messages/${selectedUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      const result = await response.json();

      if (result.success) {
        setMessages([...messages, result.data]);
        setNewMessage("");
        // Update last message in conversation list
        setConversations((prev) => {
          const updated = prev.map((conv) =>
            conv.partner._id === selectedUser._id
              ? { ...conv, lastMessage: result.data }
              : conv
          );
          // Move to top
          const current = updated.find((c) => c.partner._id === selectedUser._id);
          const others = updated.filter((c) => c.partner._id !== selectedUser._id);
          return current ? [current, ...others] : updated;
        });
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Sidebar - Conversations */}
      <div className={`w-full flex-col border-r border-slate-200 bg-slate-50 md:flex md:w-80 ${selectedUser ? 'hidden' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.partner._id}
                onClick={() => setSelectedUser(conv.partner)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                  selectedUser?._id === conv.partner._id
                    ? "bg-white shadow-sm ring-1 ring-slate-200"
                    : "hover:bg-white/50"
                }`}
              >
                <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-medium">
                  {conv.partner.name?.charAt(0).toUpperCase() || "U"}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {conv.partner.name || "Unknown User"}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`truncate text-xs ${conv.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {conv.lastMessage.message}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col bg-white ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <button 
                onClick={() => setSelectedUser(null)}
                className="md:hidden rounded-full p-2 hover:bg-slate-100 -ml-2"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-medium">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {loadingMessages ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender === selectedUser._id ? false : true; // Assuming current user is sender if not selectedUser
                  // Wait, msg.sender is an ID. I need to know MY ID.
                  // Actually, if msg.sender === selectedUser._id, then it's FROM them.
                  // If msg.sender !== selectedUser._id, it's FROM me.
                  const isFromMe = msg.sender !== selectedUser._id;
                  
                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          isFromMe
                            ? "bg-rose-500 text-white rounded-br-none"
                            : "bg-white shadow-sm border border-slate-100 text-slate-700 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className={`mt-1 text-[10px] ${isFromMe ? "text-rose-100" : "text-slate-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Select a conversation</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              Choose a client from the sidebar to start messaging or view your conversation history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
