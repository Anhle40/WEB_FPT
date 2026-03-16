'use client';

import React, { useState } from 'react';
import MarkdownText from './markdown-text';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    error?: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (message.role === 'user') {
    return (
      <div className="flex gap-4 flex-row-reverse animate-[slideUp_0.3s]">
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
    );
  }
  
  if (message.error) {
    return (
      <div className="flex gap-4 animate-[slideUp_0.3s]">
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
    );
  }
  
  return (
    <div className="flex gap-4 animate-[slideUp_0.3s]">
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
  );
}
