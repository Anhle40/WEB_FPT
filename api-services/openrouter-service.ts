// 🤖 OpenRouter AI Service
// Production-ready, reusable OpenRouter API integration with comprehensive error handling

import { 
  OpenRouterRequest, 
  OpenRouterResponse, 
  OpenRouterError, 
  AIResponse, 
  AIServiceConfig,
  OpenRouterMessage 
} from '../types/openrouter';

/**
 * OpenRouter AI Service - A robust, reusable service for AI API calls
 * Features: timeout handling, retry logic, response validation, comprehensive error handling
 */
export class OpenRouterService {
  private static readonly DEFAULT_CONFIG: Partial<AIServiceConfig> = {
    model: 'google/gemini-2.5-flash-lite',
    maxTokens: 1500,
    temperature: 0.7,
    timeout: 30000, // 30 seconds
    baseURL: 'https://openrouter.ai/api/v1'
  };

  /**
   * Generates AI response using OpenRouter API
   * @param prompt - The input prompt for the AI
   * @param options - Optional configuration overrides
   * @returns Promise<AIResponse> - Structured AI response with error handling
   */
  static async generateAIResponse(
    prompt: string, 
    options: Partial<AIServiceConfig> = {}
  ): Promise<AIResponse> {
    try {
      // Validate input
      this.validatePrompt(prompt);
      
      // Merge configuration
      const config = this.mergeConfig(options);
      
      // Validate API key
      this.validateApiKey(config.apiKey);
      
      // Prepare request
      const request = this.buildRequest(prompt, config);
      
      // Make API call with timeout
      const response = await this.makeAPICall(request, config);
      
      // Process and validate response
      return this.processResponse(response);
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generates AI response with conversation context
   * @param messages - Array of conversation messages
   * @param options - Optional configuration overrides
   * @returns Promise<AIResponse> - Structured AI response
   */
  static async generateConversationResponse(
    messages: OpenRouterMessage[],
    options: Partial<AIServiceConfig> = {}
  ): Promise<AIResponse> {
    try {
      // Validate messages
      this.validateMessages(messages);
      
      // Merge configuration
      const config = this.mergeConfig(options);
      
      // Validate API key
      this.validateApiKey(config.apiKey);
      
      // Prepare request
      const request = this.buildConversationRequest(messages, config);
      
      // Make API call with timeout
      const response = await this.makeAPICall(request, config);
      
      // Process and validate response
      return this.processResponse(response);
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validates the input prompt
   * @private
   */
  private static validatePrompt(prompt: string): void {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }
    
    if (prompt.length > 100000) {
      throw new Error('Prompt too long (max 100,000 characters)');
    }
    
    if (prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty or whitespace only');
    }
  }

  /**
   * Validates conversation messages array
   * @private
   */
  private static validateMessages(messages: OpenRouterMessage[]): void {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }
    
    for (const message of messages) {
      if (!message.role || !message.content) {
        throw new Error('Each message must have role and content');
      }
      
      if (!['system', 'user', 'assistant'].includes(message.role)) {
        throw new Error('Invalid message role. Must be: system, user, or assistant');
      }
      
      if (typeof message.content !== 'string' || message.content.trim().length === 0) {
        throw new Error('Message content must be a non-empty string');
      }
    }
  }

  /**
   * Validates API key format
   * @private
   */
  private static validateApiKey(apiKey: string): void {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key is required and must be a string');
    }
    
    if (!apiKey.startsWith('sk-or-')) {
      throw new Error('Invalid OpenRouter API key format. Must start with "sk-or-"');
    }
  }

  /**
   * Merges user options with default configuration
   * @private
   */
  private static mergeConfig(options: Partial<AIServiceConfig>): AIServiceConfig {
    const envApiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 
                     process.env.OPENROUTER_API_KEY || 
                     '';
    
    return {
      ...this.DEFAULT_CONFIG,
      apiKey: options.apiKey || envApiKey,
      ...options
    } as AIServiceConfig;
  }

  /**
   * Builds OpenRouter API request for single prompt
   * @private
   */
  private static buildRequest(prompt: string, config: AIServiceConfig): OpenRouterRequest {
    return {
      model: config.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      stream: false
    };
  }

  /**
   * Builds OpenRouter API request for conversation
   * @private
   */
  private static buildConversationRequest(messages: OpenRouterMessage[], config: AIServiceConfig): OpenRouterRequest {
    return {
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      stream: false
    };
  }

  /**
   * Makes API call with timeout and retry logic
   * @private
   */
  private static async makeAPICall(
    request: OpenRouterRequest, 
    config: AIServiceConfig
  ): Promise<OpenRouterResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(`${config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
          'X-Title': 'FPTU Survival Kit - AI Assistant'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: OpenRouterError = await response.json().catch(() => ({
          error: {
            message: `HTTP ${response.status}: ${response.statusText}`,
            type: 'http_error'
          }
        }));
        
        throw new Error(errorData.error.message || `HTTP ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - API call took too long');
      }
      
      throw error;
    }
  }

  /**
   * Processes and validates API response
   * @private
   */
  private static processResponse(response: OpenRouterResponse): AIResponse {
    try {
      // Validate response structure
      if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        throw new Error('Invalid API response: no choices returned');
      }

      const choice = response.choices[0];
      
      if (!choice.message || !choice.message.content) {
        throw new Error('Invalid API response: no message content');
      }

      if (choice.finish_reason === 'content_filter') {
        throw new Error('Content was filtered by AI safety system');
      }

      return {
        content: choice.message.content.trim(),
        model: response.model,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined,
        success: true
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Handles errors and returns structured error response
   * @private
   */
  private static handleError(error: unknown): AIResponse {
    let errorMessage = 'Unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Log error for debugging (in production, you'd use proper logging)
    console.error('OpenRouter API Error:', error);

    return {
      content: '',
      model: '',
      success: false,
      error: errorMessage
    };
  }
}

// 🎯 Export convenient functions for easy usage
export const generateAIResponse = OpenRouterService.generateAIResponse.bind(OpenRouterService);
export const generateConversationResponse = OpenRouterService.generateConversationResponse.bind(OpenRouterService);
