// 🧪 MINIMAL TEST - Test đơn giản nhất
console.log('🧪 MINIMAL TEST LOADED');

// 🔐 API Key sẽ được lấy từ Backend API - KHÔNG HARDCODE!
const TEST_API_KEY = ''; // Sẽ được thay bằng API call đến backend

// Function test đơn giản nhất
async function testSimpleChat(message) {
    console.log('🧪 Testing simple chat...');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TEST_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
                'X-Title': 'FPTU Survival Kit'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct',
                messages: [
                    {
                        role: 'system',
                        content: 'Bạn là FPTU Survival AI - đàn anh FPTU thân thiện. Trả lời ngắn gọn, hữu ích.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 250,
                temperature: 0.7
            })
        });

        console.log('🔍 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Success response:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const reply = data.choices[0].message.content;
            console.log('💬 AI Reply:', reply);
            return reply;
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('❌ Simple chat error:', error);
        return `❌ Lỗi: ${error.message}`;
    }
}

// Function prompt test đơn giản nhất
async function testSimplePrompt(prompt) {
    console.log('🧪 Testing simple prompt...');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TEST_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
                'X-Title': 'FPTU Survival Kit'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct',
                messages: [
                    {
                        role: 'system',
                        content: 'Bạn là chuyên gia prompt engineering. Phân tích prompt và cho điểm 1-10 sao, rồi gợi ý cải thiện. Trả về ngắn gọn.'
                    },
                    {
                        role: 'user',
                        content: `Phân tích prompt: "${prompt}"`
                    }
                ],
                max_tokens: 300,
                temperature: 0.3
            })
        });

        console.log('🔍 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Success response:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const reply = data.choices[0].message.content;
            console.log('💬 AI Reply:', reply);
            return reply;
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('❌ Simple prompt error:', error);
        return `❌ Lỗi: ${error.message}`;
    }
}

// Override functions hiện tại
window.checkPrompt = testSimplePrompt;
window.sendChatMessage = testSimpleChat;

console.log('🧪 MINIMAL TEST COMPLETE');
console.log('📝 Available functions:');
console.log('- testSimpleChat(message)');
console.log('- testSimplePrompt(prompt)');
console.log('- window.checkPrompt() [overridden]');
console.log('- window.sendChatMessage() [overridden]');

// Auto test
console.log('🧪 Auto testing...');
testSimpleChat('xin chào').then(result => {
    console.log('🎯 Auto chat test result:', result);
}).catch(err => {
    console.error('💥 Auto chat test failed:', err);
});

testSimplePrompt('viết email').then(result => {
    console.log('🎯 Auto prompt test result:', result);
}).catch(err => {
    console.error('💥 Auto prompt test failed:', err);
});
