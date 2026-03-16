// 🔧 Debug và Fix Check Prompt Function - Version hoàn chỉnh
// Sửa tất cả các vấn đề có thể xảy ra với OpenRouter API

async function checkPrompt(){
    const v = document.getElementById('prompt-input').value.trim();
    const r = document.getElementById('prompt-res');
    if(!v) return;
    
    // loading animation text
    r.innerHTML = `<span class="text-slate-400"><i class='fa-solid fa-spinner fa-spin'></i> Đang phân tích và tối ưu prompt...</span>`;
    
    console.log('🔍 Starting prompt check...');
    console.log('📝 Input prompt:', v);

    try {
        // 🤖 Lấy API key
        const API_KEY = window.OPENROUTER_API_KEY || "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";
        console.log('🔑 API Key format check:', API_KEY ? API_KEY.substring(0, 15) + '...' : 'MISSING');
        
        if (!API_KEY || !API_KEY.startsWith("sk-or-")) {
            throw new Error("OpenRouter API key không hợp lệ hoặc thiếu");
        }
        
        const API_URL = "https://openrouter.ai/api/v1/chat/completions";
        console.log('🌐 API URL:', API_URL);

        // 📝 Request body theo đúng format OpenRouter
        const requestBody = {
            model: "google/gemini-2.5-flash-lite",
            messages: [
                {
                    role: "system",
                    content: "Bạn là một chuyên gia Prompt Engineering cấp cao. Nhiệm vụ của bạn là đánh giá và tối ưu hóa câu lệnh (prompt) mà người dùng nhập vào. Hãy trả lời bằng mã HTML (không dùng markdown) với cấu trúc 2 phần rõ ràng: Phần 1: 💡 Đánh giá nhanh: Đánh giá điểm mạnh, điểm yếu của prompt này (VD: thiếu ngữ cảnh, thiếu vai trò...). Trả lời thật ngắn gọn. Phần 2: ✨ Prompt tối ưu: Viết lại một prompt hoàn chỉnh, chuyên nghiệp nhất dựa trên ý định của người dùng, áp dụng các kỹ thuật như đặt vai trò (Act as...), cung cấp context, và yêu cầu format rõ ràng."
                },
                {
                    role: "user",
                    content: v
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        };
        
        console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://fptu-survival-kit.vercel.app",
                "X-Title": "FPTU Survival Kit Prompt Checker"
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('📄 Full response data:', data);
        
        if (!response.ok) {
            console.log('❌ API Error Response:', data);
            throw new Error(`API Error ${response.status}: ${data.error?.message || data.message || 'Unknown error'}`);
        }

        // ✅ Kiểm tra response format của OpenRouter
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const reply = data.choices[0].message.content;
            console.log('💬 AI Reply:', reply);
            
            // Format reply for display
            const formattedReply = window.formatMarkdownToHTML ? 
                window.formatMarkdownToHTML(reply) : 
                reply.replace(/\n/g, '<br>');
            
            r.innerHTML = formattedReply;
            console.log('✅ Prompt analysis displayed successfully');
        } else {
            console.log('❌ Invalid response format:', data);
            throw new Error('API response không đúng format');
        }
        
    } catch (err) {
        console.log('💥 Prompt Check Error:', err);
        const errorMessage = err.message || 'Lỗi không xác định';
        console.log('🚫 Detailed error:', errorMessage);
        r.innerHTML = `<span class="text-red-600 font-bold"><i class='fa-solid fa-triangle-exclamation'></i> Lỗi: ${errorMessage}</span><br><small>Check console for details</small>`;
    }
}
