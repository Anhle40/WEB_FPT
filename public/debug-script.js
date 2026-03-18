// 🧪 DEBUG SCRIPT - Kiểm tra trực tiếp
console.log('🧪 DEBUG SCRIPT LOADED');

// Kiểm tra window object
console.log('🔍 Window Object Check:');
console.log('- window.checkPrompt:', typeof window.checkPrompt);
console.log('- window.sendChatMessage:', typeof window.sendChatMessage);

// 🔐 API Key sẽ được lấy từ Backend API - KHÔNG HARDCODE!
const API_KEY = ''; // Sẽ được thay bằng API call đến backend
console.log('🔑 API Key Check:');
console.log('- API Key length:', API_KEY.length);
console.log('- API Key valid:', API_KEY.startsWith('sk-or-v1-') ? '✅ Yes' : '❌ No');

// Test API call trực tiếp
async function testDirectAPI() {
    console.log('🧪 Testing Direct API Call...');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
                'X-Title': 'FPTU Survival Kit'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Test message - xin chào'
                    }
                ],
                max_tokens: 250,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Direct API Success:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('💬 AI Reply:', data.choices[0].message.content);
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('❌ Direct API Error:', error);
        return `❌ Lỗi: ${error.message}`;
    }
}

// Test prompt check trực tiếp
async function testDirectPromptCheck() {
    console.log('🧪 Testing Direct Prompt Check...');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
                'X-Title': 'FPTU Survival Kit'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Bạn là chuyên gia về prompt engineering. Phân tích prompt sau và cho điểm chất lượng từ 1-10, rồi gợi ý cải thiện.'
                    },
                    {
                        role: 'user',
                        content: 'viết email cho giảng viên'
                    }
                ],
                max_tokens: 600,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Direct Prompt Check Success:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('💬 AI Reply:', data.choices[0].message.content);
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('❌ Direct Prompt Check Error:', error);
        return `❌ Lỗi: ${error.message}`;
    }
}

// Export test functions
window.testDirectAPI = testDirectAPI;
window.testDirectPromptCheck = testDirectPromptCheck;

console.log('🧪 DEBUG SCRIPT COMPLETE');
console.log('📝 Test commands:');
console.log('- testDirectAPI()');
console.log('- testDirectPromptCheck()');
