// 🤖 FPTU AI - Unified API Client
// Chat AI và Check Prompt dùng chung API

// 🔐 API Key sẽ được lấy từ Backend API - KHÔNG HARDCODE!
const API_KEY = ''; // Sẽ được thay bằng API call đến backend
const MODEL = 'meta-llama/llama-3.1-8b-instruct';

// Global conversation context
let conversationHistory = [];

// 🤖 Unified API Call Function - Gọi Backend API
async function callOpenAPI(messages, maxTokens = 250, temperature = 0.7) {
    try {
        console.log('🚀 Calling Backend API...');
        console.log('📝 Messages:', messages.length);
        
        // 🔐 Gọi Backend API thay vì Direct API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: messages[messages.length - 1].content,
                model: MODEL,
                temperature: temperature,
                maxTokens: maxTokens
            })
        });

        console.log('📊 Backend Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Backend API Error:', errorData);
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Backend API Success:', data);

        if (data.reply) {
            return data.reply;
        } else {
            throw new Error('Invalid response format from Backend API');
        }
        
    } catch (error) {
        console.error("💥 Lỗi Backend API:", error);
        throw new Error("Không thể kết nối đến Backend API. Vui lòng kiểm tra lại.");
    }
}

// 💬 Chat AI Function
async function sendChatMessage(userMessage) {
    try {
        console.log('💬 Chat AI Request:', userMessage);
        
        // Add to conversation history
        conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Prepare messages
        const messages = [
            {
                role: 'system',
                content: `Bạn là "FPTU Survival AI" - đàn anh/đàn chị khóa trên xuất sắc, am hiểu mọi ngóc ngách FPTU. Nhiệm vụ tư vấn cho tân sinh viên chính xác, ngắn gọn, thực tế.

FPTU DICTIONARY:
- MAD/MAD101: Toán rời rạc
- PRF/PRF192: Lập trình C cơ bản
- PRO/PRO192: Lập trình hướng đối tượng Java
- CEA/CEA201: Kiến trúc máy tính
- MAE/MAC: Toán giải tích, đại số tuyến tính
- NWC/CSI: Mạng máy tính/Cơ sở CNTT
- LUK: Little UK (học tiếng Anh)
- FAP: FPT Academic Portal
- EduNext: nền tảng học tập
- PE: Practical Exam
- FE: Final Exam
- PT: Progress Test

QUY TẮC TRẢ LỜI:
1. Thẳng vào vấn đề
2. Ngắn gọn, dễ hiểu
3. Giọng thân thiện: "bác", "bro", "bạn"
4. Nếu mã môn lạ: hỏi lại
5. Không bịa đặt kiến thức`
            },
            ...conversationHistory.slice(-10) // Keep last 10 messages
        ];

        const reply = await callOpenAPI(messages, 250, 0.7);
        
        // Add assistant reply to history
        conversationHistory.push({
            role: 'assistant',
            content: reply
        });

        console.log('✅ Chat AI Reply:', reply);
        return reply;

    } catch (error) {
        console.error('💥 Chat AI Error:', error);
        return '❌ Xin lỗi, AI đang gặp sự cố. Thử lại sau nhé bro! 🫠';
    }
}

// 🔍 Check Prompt Function
async function checkPrompt(prompt) {
    try {
        console.log('🔍 Check Prompt Request:', prompt);
        
        const messages = [
            {
                role: 'system',
                content: `Bạn là chuyên gia kiểm tra và tối ưu hóa prompts cho sinh viên FPTU. Nhiệm vụ:
1. Phân tích prompt người dùng nhập
2. Đánh giá chất lượng (1-10 sao)
3. Gợi ý cách cải thiện
4. Viết lại prompt tốt hơn

Trả về format text thuần với:
- Điểm chất lượng: ⭐⭐⭐ (1-10 sao)
- Phân tích ngắn gọn
- Gợi ý cải thiện cụ thể
- Prompt cải tiến

Ví dụ:
⭐⭐⭐⭐⭐
Prompt của bạn rất rõ ràng và cụ thể.

Gợi ý cải thiện:
- Thêm lý do cụ thể
- Thêm thời gian
- Thêm phương thức liên hệ

Prompt cải tiến:
"Thưa thầy/cô [Tên], em là sinh viên [Mã số]. Em viết email này để..."`
            },
            {
                role: 'user',
                content: `Kiểm tra và tối ưu prompt: "${prompt}"`
            }
        ];

        const reply = await callOpenAPI(messages, 600, 0.3);
        
        console.log('✅ Check Prompt Reply:', reply);
        return reply;

    } catch (error) {
        console.error('💥 Check Prompt Error:', error);
        return '❌ Không thể kiểm tra prompt. Thử lại sau nhé!';
    }
}

// Reset conversation
function resetConversation() {
    conversationHistory = [];
    console.log('🔄 Conversation reset');
}

// Export functions
window.sendChatMessage = sendChatMessage;
window.checkPrompt = checkPrompt;
window.resetConversation = resetConversation;

// 🚀 NEW: Senior AI Integration Developer - sendPromptCheck Function
window.sendPromptCheck = async function(promptText) {
    // 🔐 Gọi Backend API thay vì Direct API
    const API_KEY = ''; // Không cần API key ở frontend
    
    try {
        console.log('🚀 sendPromptCheck - Backend API Call...');
        console.log('📝 Input prompt:', promptText);
        
        // 🔐 Gọi Backend API /api/check-prompt
        const response = await fetch('/api/check-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: promptText,
                model: 'google/gemini-2.5-flash',
                temperature: 0.1,
                maxTokens: 1500
            })
        });

        console.log('📊 Backend Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Backend API Error:', errorData);
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Backend API Success:', data);

        if (data.reply) {
            return data.reply;
        } else {
            throw new Error('Invalid response format from Backend API');
        }
        
    } catch (error) {
        console.error("💥 Lỗi Check Prompt:", error);
        throw new Error("Không thể kết nối đến Backend API. Vui lòng kiểm tra lại.");
    }
};

console.log('🤖 FPTU AI Client Loaded - Unified API for Chat & Prompt');
console.log('🔑 API Key:', API_KEY ? '✅ Ready' : '❌ Missing');
console.log('🤖 Model:', MODEL);
console.log('💬 Functions: sendChatMessage, checkPrompt, sendPromptCheck (NEW)');
