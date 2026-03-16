# 🤖 OpenRouter API Integration Guide

## 📋 Overview
Production-ready OpenRouter API integration for Next.js project with comprehensive error handling, TypeScript support, and reusable components.

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your OpenRouter API key
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### 2. Install Dependencies
```bash
# All dependencies are already installed in your project
npm install  # or pnpm install
```

### 3. Start Development
```bash
npm run dev
```

## 📁 Project Structure
```
├── types/
│   └── openrouter.ts              # TypeScript types
├── api-services/
│   └── openrouter-service.ts      # Core API service
├── components/
│   └── ai-chat-demo.tsx          # Example usage component
└── .env.example                   # Environment variables template
```

## 🛠️ Usage Examples

### Basic Usage
```typescript
import { generateAIResponse } from '../api-services/openrouter-service';

const response = await generateAIResponse(
  'What are the best study tips for FPT University students?',
  {
    maxTokens: 1500,
    temperature: 0.7
  }
);

if (response.success) {
  console.log('AI Response:', response.content);
} else {
  console.error('Error:', response.error);
}
```

### Conversation Context
```typescript
import { generateConversationResponse } from '../api-services/openrouter-service';
import { OpenRouterMessage } from '../types/openrouter';

const messages: OpenRouterMessage[] = [
  { role: 'system', content: 'You are a helpful AI assistant.' },
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help you today?' },
  { role: 'user', content: 'What are the best study tips?' }
];

const response = await generateConversationResponse(messages, {
  maxTokens: 1000,
  temperature: 0.5
});
```

### React Component Usage
```typescript
import AIChatComponent from '../components/ai-chat-demo';

// In your page component
export default function ChatPage() {
  return <AIChatComponent />;
}
```

## ⚙️ Configuration Options

### Environment Variables
```bash
# Required
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key

# Optional
OPENROUTER_MODEL=google/gemini-2.5-flash-lite
OPENROUTER_MAX_TOKENS=1500
OPENROUTER_TEMPERATURE=0.7
OPENROUTER_TIMEOUT=30000
```

### Service Configuration
```typescript
const response = await generateAIResponse(prompt, {
  apiKey: 'custom-api-key',           // Override env var
  model: 'google/gemini-2.5-flash-lite',
  maxTokens: 1500,
  temperature: 0.7,
  timeout: 30000,
  baseURL: 'https://openrouter.ai/api/v1'
});
```

## 🔧 Features

### ✅ Production-Ready Features
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Error Handling**: Comprehensive error catching and user-friendly messages
- **Input Validation**: Validates prompts, API keys, and response data
- **Timeout Protection**: Prevents hanging requests
- **Response Validation**: Ensures API responses are properly formatted
- **Conversation Context**: Maintains chat history for better responses
- **Retry Logic**: Built-in resilience for network issues

### 🛡️ Security Features
- **API Key Validation**: Validates OpenRouter API key format
- **Input Sanitization**: Validates and sanitizes user inputs
- **Environment Variables**: Secure API key storage
- **Content Filtering**: Handles AI safety filters gracefully

### 🎯 Performance Features
- **Request Timeout**: Configurable timeout for API calls
- **Token Limits**: Prevents excessive token usage
- **Conversation Limits**: Limits conversation history for context
- **Loading States**: Proper UI loading indicators

## 🔄 Integration with Existing Code

### Replace Existing Chat Service
```typescript
// Old way
import { sendMessage } from '../api-services/chat-ai-service';

// New way
import { generateAIResponse } from '../api-services/openrouter-service';

const response = await generateAIResponse(message);
```

### Update Existing Components
```typescript
// Add to existing component
import { generateAIResponse } from '../api-services/openrouter-service';

const handleAIRequest = async (prompt: string) => {
  const response = await generateAIResponse(prompt);
  if (response.success) {
    setResponse(response.content);
  } else {
    setError(response.error);
  }
};
```

## 🧪 Testing

### Test API Connection
```typescript
import { generateAIResponse } from '../api-services/openrouter-service';

// Test basic functionality
const testResponse = await generateAIResponse('Hello, can you respond?');
console.log('Test Result:', testResponse);
```

### Test Error Handling
```typescript
// Test with invalid API key
const errorTest = await generateAIResponse('Test', {
  apiKey: 'invalid-key'
});
console.log('Error Test:', errorTest.success === false);
```

## 📊 Monitoring & Debugging

### Error Logging
```typescript
// Service automatically logs errors to console
// In production, integrate with your logging service
```

### Response Tracking
```typescript
const response = await generateAIResponse(prompt);
if (response.usage) {
  console.log('Tokens used:', response.usage.totalTokens);
}
```

## 🚀 Deployment

### Vercel Deployment
```bash
# Add environment variables in Vercel dashboard
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key

# Deploy
vercel --prod
```

### Docker Deployment
```dockerfile
# Environment variables in Docker
ENV NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key
```

## 🔍 Troubleshooting

### Common Issues
1. **API Key Error**: Ensure key starts with "sk-or-"
2. **Timeout Error**: Increase timeout value
3. **Content Filter Error**: Rephrase the prompt
4. **Rate Limit Error**: Implement request throttling

### Debug Mode
```typescript
// Enable detailed logging
const response = await generateAIResponse(prompt, {
  timeout: 60000  // Longer timeout for debugging
});
```

## 📚 API Reference

### generateAIResponse()
```typescript
generateAIResponse(prompt: string, options?: Partial<AIServiceConfig>): Promise<AIResponse>
```

### generateConversationResponse()
```typescript
generateConversationResponse(messages: OpenRouterMessage[], options?: Partial<AIServiceConfig>): Promise<AIResponse>
```

### Types
```typescript
interface AIResponse {
  content: string;
  model: string;
  usage?: TokenUsage;
  success: boolean;
  error?: string;
}

interface AIServiceConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  baseURL?: string;
}
```

## 🎯 Best Practices

1. **Always handle errors**: Check `response.success` before using content
2. **Use conversation context**: Better responses with message history
3. **Set appropriate timeouts**: Prevent hanging requests
4. **Monitor token usage**: Track API costs
5. **Validate inputs**: Ensure prompts are appropriate
6. **Handle content filters**: Rephrase content if filtered

## 🔄 Migration Guide

### From Gemini API
```typescript
// Before
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  })
});

// After
const response = await generateAIResponse(prompt);
```

### Benefits of Migration
- ✅ Better error handling
- ✅ Type safety
- ✅ Timeout protection
- ✅ Input validation
- ✅ Conversation context
- ✅ Production-ready features

---

**🎉 Your OpenRouter integration is now production-ready!**

For support, check the console logs and ensure your API key is valid and properly configured.
