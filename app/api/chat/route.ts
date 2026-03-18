import { NextRequest, NextResponse } from 'next/server';

// 🔐 Backend API Route - Chat AI
// Bảo mật: API key chỉ tồn tại trên server-side
export async function POST(request: NextRequest) {
  try {
    // 🔐 Lấy API key từ environment variables (server-side)
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, model = 'meta-llama/llama-3.1-8b-instruct', temperature = 0.7, maxTokens = 250 } = body;

    console.log('🚀 Backend Chat API Call...');
    console.log('📝 Message:', message);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'FPTU Survival Kit - Chat AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Bạn là trợ lý AI thân thiện cho sinh viên FPTU. Hãy trả lời ngắn gọn, hữu ích và dễ hiểu.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Backend API Error:', errorData);
      return NextResponse.json(
        { error: `API Error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend API Success:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      return NextResponse.json({ reply });
    } else {
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('💥 Backend Chat Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
