// 🤖 Simple AI Component - Minimal example for quick integration
// Stripped-down version showing the easiest way to use OpenRouter API

'use client';

import React, { useState } from 'react';
import { generateAIResponse } from '../api-services/openrouter-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bot } from 'lucide-react';

/**
 * SimpleAIComponent - Minimal example for quick OpenRouter integration
 * Perfect for getting started with the API
 */
export default function SimpleAIComponent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // 🚀 Simple API call - one line of code!
      const aiResponse = await generateAIResponse(prompt, {
        maxTokens: 1000,
        temperature: 0.7,
        model: 'google/gemini-2.5-flash-lite'
      });

      if (aiResponse.success) {
        setResponse(aiResponse.content);
      } else {
        setError(aiResponse.error || 'Failed to generate response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Simple AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Prompt:</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question or prompt here..."
            className="min-h-[100px]"
          />
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            'Generate AI Response'
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Response:</label>
            <div className="p-3 bg-gray-50 border rounded-md">
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p><strong>Quick Start:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>• Type a prompt and click "Generate AI Response"</li>
            <li>• Uses OpenRouter API with Gemini 2.5 Flash Lite</li>
            <li>• Includes automatic error handling</li>
            <li>• Copy this component for easy integration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
