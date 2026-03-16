// 🤖 Client-side API functions - Không expose API key
// Sử dụng Next.js API routes để bảo mật

// Chat API function
async function sendChatMessage(userMessage) {
  try {
    console.log('🚀 Sending chat request to API route...');
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Bạn là trợ lý AI FPTU Survival Kit. Hãy trả lời NGẮN GỌN, XÚC TÍCH, DỄ HIỂU (dưới 100 từ). Tập trung vào giải pháp thực tế cho sinh viên FPTU. Trả lời như người bạn thân thiện, không dùng câu quá trang trọng.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        model: 'google/gemini-2.5-flash-lite',
        max_tokens: 300,
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
        max_tokens: 400,
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

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
window.checkPrompt = checkPrompt;
