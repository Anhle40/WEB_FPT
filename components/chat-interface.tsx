'use client';

import React, { useState } from 'react';
import MarkdownText from './markdown-text';

interface ChatInterfaceProps {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    error?: string;
  }>;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleQuickQuestion = (question: string) => {
    if (!isLoading) {
      onSendMessage(question);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <i className="fas fa-robot text-xl"></i>
          <h2 className="text-lg font-bold">FPTU AI Assistant</h2>
        </div>
        <p className="text-sm text-blue-100 mt-1">Hỗ trợ sinh viên FPTU 24/7</p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Xin chào! Tôi có thể giúp gì?</h3>
            <p className="text-gray-500 mb-6">Hỏi tôi bất cứ điều gì về đời sống sinh viên FPTU</p>
            
            {/* Quick Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
              <button
                onClick={() => handleQuickQuestion('Học phí kỳ này bao nhiêu?')}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
              >
                <span className="text-lg mr-2">💰</span> Học phí
              </button>
              <button
                onClick={() => handleQuickQuestion('Mất gốc môn C phải làm sao?')}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
              >
                <span className="text-lg mr-2">😭</span> Mất gốc Code
              </button>
              <button
                onClick={() => handleQuickQuestion('Review môn MAD101')}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
              >
                <span className="text-lg mr-2">📚</span> Review Toán rời rạc
              </button>
              <button
                onClick={() => handleQuickQuestion('Crush lạnh lùng quá')}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
              >
                <span className="text-lg mr-2">💔</span> Tư vấn tình cảm
              </button>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className="animate-[slideUp_0.3s]">
            {message.role === 'user' ? (
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center shrink-0 text-sm shadow-lg">
                  <i className="fas fa-user"></i>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[85%] break-words">
                  <div className="text-xs text-orange-100 font-medium mb-1">Bạn</div>
                  <div className="text-base">{message.content}</div>
                  <div className="text-xs text-orange-100 mt-1">
                    {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ) : message.error ? (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center shrink-0 text-sm shadow-lg">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] break-words">
                  <div className="text-xs text-red-600 font-medium mb-2 flex items-center gap-1">
                    <i className="fas fa-bug"></i>
                    <span>Lỗi Kết Nối</span>
                  </div>
                  <div className="text-red-700 text-sm">{message.error}</div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                    <span>🔄 Thử lại sau vài giây</span>
                    <span>•</span>
                    <span>{message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 text-sm shadow-lg">
                  <i className="fas fa-sparkles"></i>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] leading-relaxed text-base break-words">
                  <div className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1">
                    <i className="fas fa-robot"></i>
                    <span>FPTU AI Assistant</span>
                  </div>
                  
                  <div className="text-slate-700">
                    <MarkdownText text={message.content} />
                  </div>
                  
                  <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                    <span>🚀 Powered by Gemini 2.5 Flash</span>
                    <span>•</span>
                    <span>{message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 text-sm">
              <i className="fas fa-robot"></i>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
