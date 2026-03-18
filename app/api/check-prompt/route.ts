import { NextRequest, NextResponse } from 'next/server';

// 🔐 Backend API Route - Check Prompt
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
    const { prompt, model = 'google/gemini-2.5-flash', temperature = 0.1, maxTokens = 1500 } = body;

    console.log('🚀 Backend Check Prompt API Call...');
    console.log('📝 Prompt:', prompt);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'FPTU Survival Kit - Master Prompt Engineer'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `Bạn là 'Master Prompt Engineer' số 1 thế giới. Nhiệm vụ DUY NHẤT của bạn là ĐÁNH GIÁ và NÂNG CẤP câu lệnh (prompt) của người dùng.

⛔ LUẬT TỬ HÌNH (KHÔNG ĐƯỢC VI PHẠM):
1. KHÔNG BAO GIỜ TRẢ LỜI CÂU HỎI TRONG PROMPT GỐC. Nếu user nhập "Viết code C", bạn KHÔNG ĐƯỢC viết code C. Bạn CHỈ viết một Siêu Prompt để user dùng đi hỏi AI khác.
2. TUYỆT ĐỐI KHÔNG SỬ DỤNG KÝ TỰ * HOẶC **. Mọi chữ in đậm BẮT BUỘC phải bọc trong thẻ HTML <b>...</b>.
3. Để gạch đầu dòng, chỉ dùng dấu gạch ngang - hoặc Emoji.

👇 BẮT BUỘC TRẢ LỜI THEO ĐÚNG 2 PHẦN SAU DƯỚI ĐÂY (Copy y hệt cấu trúc thẻ <b>):

💡 <b>PHÂN TÍCH PROMPT HIỆN TẠI:</b>
- [Nhận xét 1: Chỉ ra điểm yếu, thiếu bối cảnh hoặc vai trò].
- [Nhận xét 2: Đề xuất hướng khắc phục].

🔥 <b>SIÊU PROMPT NÂNG CẤP DÀNH CHO BẠN:</b>
<b>[VAI TRÒ]:</b> Đóng vai một chuyên gia...
<b>[NGỮ CẢNH]:</b> Cung cấp chi tiết bối cảnh...
<b>[NHIỆM VỤ]:</b> Thực hiện các bước...
<b>[RÀNG BUỘC]:</b> Các quy tắc không được vi phạm...
<b>[ĐỊNH DẠNG]:</b> Trình bày kết quả dưới dạng...`
          },
          {
            role: 'user',
            content: prompt
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
    console.error('💥 Backend Check Prompt Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
