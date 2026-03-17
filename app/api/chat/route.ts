import { NextRequest, NextResponse } from 'next/server';
import { generateConversationResponse } from '../../../api-services/openrouter-service';
import { OpenRouterMessage } from '../../../types/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'google/gemini-2.5-flash-lite', max_tokens = 250, temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Không thêm system prompt ở đây - đã có trong api-client.js
    // Điều này tránh lặp lại và đảm bảo consistency

    const response = await generateConversationResponse(messages as OpenRouterMessage[], {
      model,
      maxTokens: max_tokens,
      temperature
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to generate response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: response.content
          }
        }
      ],
      usage: response.usage
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
