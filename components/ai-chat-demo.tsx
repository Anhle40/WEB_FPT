'use client';

// 🤖 AI Chat Component - Example usage of OpenRouter API integration
// Production-ready React component demonstrating how to use the OpenRouter service

import React, { useState, useCallback } from 'react';
import { generateAIResponse, generateConversationResponse } from '../api-services/openrouter-service';
import { AIResponse, OpenRouterMessage } from '../types/openrouter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, Bot, User, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: string;
}

/**
 * AIChatComponent - A complete example of using OpenRouter API
 * Features: conversation history, error handling, loading states, responsive UI
 */
export default function AIChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles sending a message to the AI and getting a response
   * Uses conversation context for better responses
   */
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory: OpenRouterMessage[] = messages
        .slice(-5) // Keep last 5 messages for context
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: input.trim()
      });

      // Add system prompt for better context
      const systemPrompt: OpenRouterMessage = {
        role: 'system',
        content: 'You are a helpful AI assistant for the FPTU Survival Kit. Provide clear, concise, and helpful responses to student questions.'
      };

      const fullConversation = [systemPrompt, ...conversationHistory];

      // Call OpenRouter API with conversation context
      const response: AIResponse = await generateConversationResponse(fullConversation, {
        maxTokens: 1500,
        temperature: 0.7,
        timeout: 30000,
        model: 'google/gemini-2.5-flash-lite'
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.success ? response.content : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: response.error
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (!response.success && response.error) {
        setError(response.error);
      }

    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorText);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: errorText
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  /**
   * Simple prompt example - single message without conversation context
   */
  const handleSimplePrompt = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AIResponse = await generateAIResponse(
        'What are the best study tips for FPT University students?',
        {
          maxTokens: 500,
          temperature: 0.5
        }
      );

      if (response.success) {
        alert(`AI Response: ${response.content}`);
      } else {
        setError(response.error || 'Failed to get AI response');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles keyboard shortcuts (Enter to send, Shift+Enter for new line)
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  /**
   * Clears the conversation history
   */
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Assistant - OpenRouter Integration Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Demo Button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSimplePrompt}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Test Simple Prompt
            </Button>
            <Button 
              onClick={clearConversation}
              variant="outline"
              size="sm"
            >
              Clear Conversation
            </Button>
          </div>

          {/* Messages Display */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Start a conversation with the AI assistant!</p>
                <p className="text-sm">Powered by OpenRouter API with Gemini 2.5 Flash Lite</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary/10 ml-auto max-w-[80%]' 
                      : 'bg-muted max-w-[80%]'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.error && (
                      <p className="text-xs text-destructive mt-1">
                        Error: {message.error}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 p-3 rounded-lg bg-muted max-w-[80%]">
                <Bot className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">AI Assistant</p>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Enter to send, Shift+Enter for new line)"
              className="flex-1 min-h-[60px]"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Usage Instructions */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p><strong>Usage Examples:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>• Type messages and press Enter to send</li>
              <li>• AI maintains conversation context for better responses</li>
              <li>• Uses OpenRouter API with Gemini 2.5 Flash Lite model</li>
              <li>• Includes comprehensive error handling and validation</li>
              <li>• Responsive design with loading states</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
