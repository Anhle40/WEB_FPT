// 🤖 OpenRouter API Hook
// Custom React hook for easy OpenRouter API integration with state management

import { useState, useCallback } from 'react';
import { generateAIResponse, generateConversationResponse } from '../api-services/openrouter-service';
import { AIResponse, OpenRouterMessage, AIServiceConfig } from '../types/openrouter';

interface UseOpenRouterState {
  response: string | null;
  isLoading: boolean;
  error: string | null;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface UseOpenRouterReturn extends UseOpenRouterState {
  generateResponse: (prompt: string, options?: Partial<AIServiceConfig>) => Promise<void>;
  generateConversation: (messages: OpenRouterMessage[], options?: Partial<AIServiceConfig>) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for OpenRouter API integration
 * Provides state management and error handling for AI responses
 */
export function useOpenRouter(): UseOpenRouterReturn {
  const [state, setState] = useState<UseOpenRouterState>({
    response: null,
    isLoading: false,
    error: null,
    usage: undefined
  });

  const generateResponse = useCallback(async (
    prompt: string, 
    options?: Partial<AIServiceConfig>
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const aiResponse: AIResponse = await generateAIResponse(prompt, options);
      
      setState({
        response: aiResponse.success ? aiResponse.content : null,
        isLoading: false,
        error: aiResponse.success ? null : aiResponse.error || 'Unknown error',
        usage: aiResponse.usage
      });
    } catch (error) {
      setState({
        response: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        usage: undefined
      });
    }
  }, []);

  const generateConversation = useCallback(async (
    messages: OpenRouterMessage[], 
    options?: Partial<AIServiceConfig>
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const aiResponse: AIResponse = await generateConversationResponse(messages, options);
      
      setState({
        response: aiResponse.success ? aiResponse.content : null,
        isLoading: false,
        error: aiResponse.success ? null : aiResponse.error || 'Unknown error',
        usage: aiResponse.usage
      });
    } catch (error) {
      setState({
        response: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        usage: undefined
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      response: null,
      isLoading: false,
      error: null,
      usage: undefined
    });
  }, []);

  return {
    ...state,
    generateResponse,
    generateConversation,
    reset
  };
}
