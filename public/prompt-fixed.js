// 🔧 Debug và Fix Check Prompt Function - Version hoàn chỉnh
// Sửa tất cả các vấn đề có thể xảy ra với OpenRouter API

async function checkPrompt(){
    const v = document.getElementById('prompt-input').value.trim();
    const r = document.getElementById('prompt-res');
    if(!v) return;
    
    // loading animation text
    r.innerHTML = `<span class="text-slate-400"><i class='fa-solid fa-spinner fa-spin'></i> Đang phân tích và tối ưu prompt...</span>`;
    
    console.log('🔍 Starting prompt check via API route...');
    console.log('📝 Input prompt:', v);

    try {
        // 🚀 Gọi API route thay vì direct API call
        const response = await fetch('/api/check-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: v,
                model: 'google/gemini-2.5-flash-lite',
                max_tokens: 1000,
                temperature: 0.3
            })
        });

        console.log('📊 Response status:', response.status);

        const data = await response.json();
        console.log('📄 API Route Response:', data);
        
        if (!response.ok) {
            console.log('❌ API Error Response:', data);
            throw new Error(data.error || `API Error ${response.status}`);
        }

        // ✅ Kiểm tra response format
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
