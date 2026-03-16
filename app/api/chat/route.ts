import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'google/gemini-2.5-flash-lite', max_tokens = 300, temperature = 0.7 } = await request.json();

    // Lấy API key từ environment variable (server-side only)
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey || !apiKey.startsWith('sk-or-')) {
      return NextResponse.json(
        { error: 'API key không hợp lệ hoặc thiếu' },
        { status: 500 }
      );
    }

    console.log('🚀 Server-side API call...');
    console.log('🔑 API Key format:', apiKey.substring(0, 15) + '...');
    console.log('🎯 Model:', model);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
        'X-Title': 'FPTU Survival Kit'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature
      })
    });

    const data = await response.json();
    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      console.log('❌ API Error:', data);
      return NextResponse.json(
        { error: `API Error ${response.status}: ${data.error?.message || data.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    console.log('✅ API Success');
    return NextResponse.json(data);

  } catch (error) {
    console.log('💥 Server Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
