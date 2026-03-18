// 🧪 Test Backend API - Paste vào Developer Console

// Test Chat API
async function testChatAPI() {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Xin chào, bạn là ai?',
                model: 'meta-llama/llama-3.1-8b-instruct',
                temperature: 0.7,
                maxTokens: 250
            })
        });
        
        const data = await response.json();
        console.log('✅ Chat API Test Result:', data);
        return data;
    } catch (error) {
        console.error('❌ Chat API Test Error:', error);
        return { error: error.message };
    }
}

// Test Check Prompt API
async function testCheckPromptAPI() {
    try {
        const response = await fetch('/api/check-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: 'Viết code Python',
                model: 'google/gemini-2.5-flash',
                temperature: 0.1,
                maxTokens: 1500
            })
        });
        
        const data = await response.json();
        console.log('✅ Check Prompt API Test Result:', data);
        return data;
    } catch (error) {
        console.error('❌ Check Prompt API Test Error:', error);
        return { error: error.message };
    }
}

// Run tests
console.log('🧪 Testing Backend APIs...');
testChatAPI();
testCheckPromptAPI();

// Instructions:
// 1. Mở Developer Console (F12)
// 2. Paste code này
// 3. Enter để chạy
// 4. Kiểm tra kết quả trong console
