import { NextRequest, NextResponse } from 'next/server';
import { API_KEYS } from '../../../api-keys';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'google/gemini-2.5-flash-lite', max_tokens = 600, temperature = 0.3 } = await request.json();

    // Import API key từ secure file
    const apiKey = API_KEYS.OPENROUTER || 
                   process.env.OPENROUTER_API_KEY || 
                   process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    console.log('🔍 DEBUG - Check Prompt Route API Key:', apiKey ? apiKey.substring(0, 10) + '...' : '❌ Empty');
    
    if (!apiKey || !apiKey.startsWith('sk-or-')) {
      return NextResponse.json(
        { error: 'API key không hợp lệ hoặc thiếu' },
        { status: 500 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: `Bạn là một chuyên gia Prompt Engineering cấp cao. Nhiệm vụ của bạn là đánh giá và tối ưu hóa câu lệnh (prompt) mà người dùng nhập vào.

Dưới đây là câu lệnh của người dùng: ${prompt}

Hãy trả lời bằng MÃ HTML VỚI CẤU TRÚC 2 PHẦN RÕ RÀNG:

Phần 1: <b>💡 Đánh giá nhanh:</b> Đánh giá điểm mạnh, điểm yếu của prompt này (VD: thiếu ngữ cảnh, thiếu vai trò...). Trả lời thật ngắn gọn.

Phần 2: <b>✨ Prompt tối ưu:</b> Viết lại một prompt hoàn chỉnh, chuyên nghiệp nhất dựa trên ý định của người dùng, áp dụng các kỹ thuật như đặt vai trò (Act as...), cung cấp context, và yêu cầu format rõ ràng.

QUAN TRỌNG:
- KHÔNG dùng markdown (\`\`\`html, \`\`\`)
- KHÔNG dùng code blocks
- Trả lời thẳng HTML content
- Dùng <b> cho bold, <br> cho xuống dòng`
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

    // Clean response - remove any code blocks if present
    let content = data.choices?.[0]?.message?.content || '';
    content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    return NextResponse.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: content
          }
        }
      ],
      usage: data.usage
    });

  } catch (error) {
    console.log('💥 Prompt Check Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
