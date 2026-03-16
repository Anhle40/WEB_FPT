// 🔧 Debug và Fix Chat Function - Version hoàn chỉnh
// Sửa tất cả các vấn đề có thể xảy ra với OpenRouter API

async function sendChat(optionalText = null) {
    const inp = document.getElementById('chat-input');
    const text = optionalText || inp.value.trim();
    if (!text) return;

    const starters = document.getElementById('chat-starters');
    if (starters) starters.style.display = 'none';
    const box = document.getElementById('chat-messages');
    
    // User Message
    box.innerHTML += `<div class="flex gap-4 flex-row-reverse animate-[slideUp_0.3s]"><div class="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 text-sm"><i class="fa-solid fa-user"></i></div><div class="bg-orange-600 text-white p-4 rounded-3xl rounded-tr-none shadow text-base max-w-[85%] break-words">${text}</div></div>`;
    inp.value = "";
    box.scrollTop = box.scrollHeight;

    // Loading
    const typingId = "typing-" + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = "flex gap-4 mt-2";
    typingDiv.innerHTML = `<div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 text-sm"><i class="fa-solid fa-robot"></i></div><div class="bg-white border p-4 rounded-3xl rounded-tl-none text-sm typing-indicator"><span></span><span></span><span></span></div>`;
    box.appendChild(typingDiv);
    box.scrollTop = box.scrollHeight;

    try {
        // 🔍 DEBUG: Log tất cả các giá trị
        console.log('🚀 Starting API call...');
        console.log('📝 User message:', text);
        
        // 🤖 Lấy API key từ environment variable (KHÔNG HARDCODE)
        const API_KEY = window.OPENROUTER_API_KEY;
        console.log('🔑 API Key format check:', API_KEY ? API_KEY.substring(0, 15) + '...' : 'MISSING');
        console.log('🔑 API Key starts with sk-or-?', API_KEY && API_KEY.startsWith('sk-or-'));
        
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
                    content: "Bạn là trợ lý AI FPTU Survival Kit. Hãy trả lời thân thiện, hữu ích cho sinh viên FPTU."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        };
        
        console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
        
        // 🌐 Gọi API với đầy đủ headers
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://fptu-survival-kit.vercel.app",
                "X-Title": "FPTU Survival Kit Chat"
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('📄 Full response data:', data);
        
        // Remove typing indicator
        if(document.getElementById(typingId)) document.getElementById(typingId).remove();

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
            
            box.innerHTML += `<div class="flex gap-4 animate-[slideUp_0.3s]"><div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 text-sm"><i class="fa-solid fa-sparkles"></i></div><div class="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-none text-slate-700 shadow-sm max-w-[85%] leading-relaxed text-base break-words">${formattedReply}</div></div>`;
            
            console.log('✅ Message displayed successfully');
        } else {
            console.log('❌ Invalid response format:', data);
            throw new Error('API response không đúng format');
        }

    } catch (error) {
        console.log('💥 Chat Error:', error);
        
        // Remove typing indicator
        if(document.getElementById(typingId)) document.getElementById(typingId).remove();
        
        // Show detailed error message
        const errorMessage = error.message || 'Lỗi không xác định';
        console.log('🚫 Detailed error:', errorMessage);
        
        box.innerHTML += `<div class="flex gap-4 animate-[slideUp_0.3s]"><div class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-sm"><i class="fa-solid fa-bug"></i></div><div class="bg-red-50 border border-red-200 p-4 rounded-3xl rounded-tl-none text-red-700 shadow max-w-[85%] break-words"><b>Lỗi API:</b> ${errorMessage}<br><small>Check console for details</small></div></div>`;
    }
    
    box.scrollTop = box.scrollHeight;
}
