'use client';

import React from 'react';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export default function MarkdownText({ text, className = '' }: MarkdownTextProps) {
  // Convert markdown to JSX
  const formatText = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        // Empty line - add break
        elements.push(<br key={index} />);
        return;
      }
      
      // Check for bullet points (* at start)
      if (line.trim().startsWith('* ')) {
        const bulletText = line.trim().substring(2);
        elements.push(
          <li key={index} className="ml-4 mb-1 list-disc" style={{ color: '#475569', lineHeight: '1.5' }}>
            <span dangerouslySetInnerHTML={{ __html: formatInlineText(bulletText) }} />
          </li>
        );
        return;
      }
      
      // Regular line with inline formatting
      elements.push(
        <div key={index} dangerouslySetInnerHTML={{ __html: formatInlineText(line) }} />
      );
    });
    
    return elements;
  };
  
  // Format inline text (bold, etc.)
  const formatInlineText = (text: string): string => {
    let formatted = text;
    
    // Xử lý **bold** - thay thế tất cả
    while (formatted.includes('**')) {
      formatted = formatted.replace(/\*\*(.*?)\*\*/, '<strong class="font-bold" style="color: #1f2937; font-weight: 600;">$1</strong>');
    }
    
    // Xử lý *bold* đơn còn sót
    while (formatted.includes('*') && !formatted.includes('**')) {
      formatted = formatted.replace(/\*([^*\n]+)\*/, '<strong class="font-bold" style="color: #1f2937; font-weight: 600;">$1</strong>');
    }
    
    return formatted;
  };
  
  return (
    <div className={`text-gray-700 leading-relaxed ${className}`}>
      {formatText(text)}
    </div>
  );
}
