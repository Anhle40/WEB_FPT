// 🤖 Client-side API functions - Không expose API key
// Sử dụng Next.js API routes để bảo mật

// Global conversation context để tránh lặp lại
let conversationHistory = [];

// Chat API function
async function sendChatMessage(userMessage) {
  try {
    console.log('🚀 Sending chat request to API route...');
    
    // Chỉ gửi user message - system prompt sẽ được xử lý ở server
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Bạn là "FPTU Survival AI" - đàn anh/đàn chị khóa trên xuất sắc, am hiểu mọi ngóc ngách FPTU. Nhiệm vụ tư vấn cho tân sinh viên chính xác, ngắn gọn, thực tế.

FPTU DICTIONARY (BẮT BUỘC):
- MAD/MAD101: Toán rời rạc (KHÔNG phải lập trình di động)
- PRF/PRF192: Lập trình C cơ bản (rất khó, hay rớt)
- PRO/PRO192: Lập trình hướng đối tượng Java
- CEA/CEA201: Kiến trúc máy tính
- MAE/MAC: Toán giải tích, đại số tuyến tính
- NWC/CSI: Mạng máy tính/Cơ sở CNTT
- LUK: Little UK (học tiếng Anh theo mức độ)
- FAP: FPT Academic Portal (điểm, lịch học)
- EduNext: nền tảng học tập đánh giá chéo
- PE: Practical Exam (thi thực hành, điểm liệt 4.0)
- FE: Final Exam (thi lý thuyết, điểm liệt 4.0)
- PT: Progress Test (kiểm tra quá trình)

QUY TẮC TRẢ LỜI:
1. THẲNG VÀO VẤN ĐỀ, không vòng vo
2. Gạch đầu dòng ngắn gọn
3. Giọng thân thiện: "bác", "bro", "bạn", "mình", "ae"
4. Nếu mã môn lạ: hỏi lại "Môn này tên tiếng Anh/đầy đủ là gì hả bro?"
5. TUYỆT ĐỐI KHÔNG BỊA ĐẶT KIẾN THỨC`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        model: 'google/gemini-2.5-flash-lite',
        max_tokens: 250,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('📊 API Route Response:', response.status);

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format');
    }

  } catch (error) {
    console.error('💥 Chat API Error:', error);
    throw error;
  }
}

// Prompt check API function
async function checkPrompt(prompt) {
  try {
    console.log('🔍 Checking prompt via API route...');
    
    const response = await fetch('/api/check-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model: 'google/gemini-2.5-flash-lite',
        max_tokens: 600,
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    // Return HTML content directly
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format');
    }

  } catch (error) {
    console.error('💥 Prompt Check Error:', error);
    throw error;
  }
}

// Export để dùng trong browser
window.sendChatMessage = sendChatMessage;
window.sendPromptCheck = checkPrompt;
