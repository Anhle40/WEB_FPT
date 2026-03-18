// 🤖 Client-side API functions - Sử dụng OpenRouter API
// Bảo mật với environment variables

// Global conversation context để tránh lặp lại
let conversationHistory = [];

// Chat API function với OpenRouter
async function sendChatMessage(userMessage) {
  try {
    console.log('🚀 Sending chat request to OpenRouter...');
    
    // 🔐 API Key sẽ được lấy từ Backend API - KHÔNG HARDCODE!
    const OPENROUTER_API_KEY = ''; // Sẽ được thay bằng API call đến backend
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API Key không được cấu hình! Vui lòng kiểm tra file .env.local');
    }
    
    // Thêm vào conversation history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Giới hạn history để tránh token limit
    const maxHistory = 10;
    const messages = [
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
      ...conversationHistory.slice(-maxHistory)
    ];
    
    // Gọi OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'FPTU Survival Kit - Chat SOS'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: messages,
        max_tokens: 250,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('📊 OpenRouter Response:', response.status);

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API request failed');
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      
      // Thêm vào conversation history
      conversationHistory.push({
        role: 'assistant',
        content: reply
      });
      
      return reply;
    } else {
      throw new Error('Invalid response format from OpenRouter');
    }

  } catch (error) {
    console.error('💥 Chat API Error:', error);
    
    // Fallback message
    if (error.message.includes('API Key')) {
      return '❌ Lỗi cấu hình: OpenRouter API Key chưa được thiết lập. Admin cần kiểm tra file .env.local';
    } else {
      return '❌ Xin lỗi, AI đang gặp sự cố. Thử lại sau nhé bro! 🫠';
    }
  }
}

// Prompt check API function với OpenRouter
async function checkPromptAPI(prompt) {
  try {
    console.log('🔍 Checking prompt via OpenRouter...');
    console.log('🔍 Prompt input:', prompt);
    
    // 🔐 API Key sẽ được lấy từ Backend API - KHÔNG HARDCODE!
    const OPENROUTER_API_KEY = ''; // Sẽ được thay bằng API call đến backend
    
    console.log('🔑 API Key check:', OPENROUTER_API_KEY ? '✅ Found' : '❌ Missing');
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API Key không được cấu hình!');
    }
    
    console.log('🌐 Making API request...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'FPTU Survival Kit - Prompt Check'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: 'system',
            content: `Bạn là chuyên gia kiểm tra và tối ưu hóa prompts cho sinh viên FPTU. Nhiệm vụ:
1. Phân tích prompt người dùng nhập
2. Đánh giá chất lượng (1-10)
3. Gợi ý cách cải thiện
4. Viết lại prompt tốt hơn

Trả về format text thuần với:
- Điểm chất lượng: ⭐⭐⭐ (1-10 sao)
- Phân tích ngắn gọn
- Gợi ý cải thiện cụ thể
- Prompt cải tiến

Ví dụ:
⭐⭐⭐⭐⭐
Prompt của bạn rất rõ ràng và cụ thể. Bạn đã xác định rõ đối tượng (giảng viên) và mục tiêu (xin phép nghỉ học). 

Gợi ý cải thiện:
- Thêm lý do cụ thể (sức khỏe, gia đình, công việc)
- Thêm thời gian nghỉ học mong muốn
- Thêm phương thức liên hệ

Prompt cải tiến:
"Thưa thầy/cô [Tên giảng viên], em là sinh viên [Mã số] lớp [Tên lớp]. Em viết email này để xin phép nghỉ học từ [ngày bắt đầu] đến [ngày kết thúc] do [lý do cụ thể]. Em sẽ theo dõi bài học trên hệ thống và hoàn thành các bài tập muộn. Em cảm ơn thầy/cô!"`
          },
          {
            role: 'user',
            content: `Kiểm tra và tối ưu prompt sau: "${prompt}"`
          }
        ],
        max_tokens: 600,
        temperature: 0.3
      })
    });

    const data = await response.json();
    console.log('📊 API Response:', data);
    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(`OpenRouter API Error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      console.log('✅ AI Reply:', reply);
      return reply;
    } else {
      console.error('❌ Invalid response format:', data);
      throw new Error('Invalid response format from OpenRouter');
    }

  } catch (error) {
    console.error('💥 Prompt Check Error:', error);
    
    if (error.message.includes('API Key')) {
      const errorMsg = '❌ Lỗi cấu hình: OpenRouter API Key chưa được thiết lập';
      console.log('🔄 Returning error message:', errorMsg);
      return errorMsg;
    } else {
      const errorMsg = `❌ Không thể kiểm tra prompt: ${error.message}`;
      console.log('🔄 Returning error message:', errorMsg);
      return errorMsg;
    }
  }
}

// Reset conversation history
function resetConversation() {
  conversationHistory = [];
  console.log('🔄 Conversation history reset');
}

// Export functions
window.sendChatMessage = sendChatMessage;
window.checkPrompt = checkPromptAPI;
window.resetConversation = resetConversation;

console.log('🤖 API Client loaded - Using OpenRouter API');
