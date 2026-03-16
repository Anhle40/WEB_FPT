import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'google/gemini-2.5-flash-lite', max_tokens = 400, temperature = 0.3 } = await request.json();

    // Lấy API key từ environment variable (server-side only)
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey || !apiKey.startsWith('sk-or-')) {
      return NextResponse.json(
        { error: 'API key không hợp lệ hoặc thiếu' },
        { status: 500 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: 'Bạn là chuyên gia Prompt Engineering. Hãy đánh giá và tối ưu prompt NGẮN GỌN, DỄ HIỂU. Trả lời bằng HTML với 2 phần: 1) 💡 Đánh giá nhanh (dưới 50 từ) 2) ✨ Prompt tối ưu (dưới 100 từ).'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
        'X-Title': 'FPTU Survival Kit - Prompt Check'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: `API Error ${response.status}: ${data.error?.message || data.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.log('💥 Prompt Check Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
