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
        content: 'Bạn là một chuyên gia Prompt Engineering cấp cao. Nhiệm vụ của bạn là đánh giá và tối ưu hóa câu lệnh (prompt) mà người dùng nhập vào. Hãy trả lời bằng mã HTML (không dùng markdown) với cấu trúc 2 phần rõ ràng: Phần 1: 💡 Đánh giá nhanh: Đánh giá điểm mạnh, điểm yếu của prompt này (VD: thiếu ngữ cảnh, thiếu vai trò...). Trả lời thật ngắn gọn. Phần 2: ✨ Prompt tối ưu: Viết lại một prompt hoàn chỉnh, chuyên nghiệp nhất dựa trên ý định của người dùng, áp dụng các kỹ thuật như đặt vai trò (Act as...), cung cấp context, và yêu cầu format rõ ràng.'
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
