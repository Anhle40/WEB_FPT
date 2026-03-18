// 🛡️ OpenRouter API Client - AN TOÀN TUYỆT ĐỐI
// File này không chứa API key - chỉ đọc từ environment

class OpenRouterClient {
    constructor() {
        // 🔐 Đọc API key từ environment variables
        this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
        this.baseURL = 'https://openrouter.ai/api/v1';
        
        // 🛡️ Kiểm tra API key
        if (!this.apiKey) {
            console.error('❌ OpenRouter API Key không được cấu hình!');
            console.error('📝 Hãy thêm vào file .env.local:');
            console.error('   NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key_here');
        }
    }

    // ✅ Kiểm tra API key có hợp lệ không
    isConfigured() {
        return !!this.apiKey && this.apiKey !== 'your_api_key_here';
    }

    // 🚀 Gọi API với bảo mật
    async chatCompletion(prompt, options = {}) {
        try {
            // 🛡️ Validate API key trước khi gọi
            if (!this.isConfigured()) {
                throw new Error('OpenRouter API Key không được cấu hình!');
            }

            // 📝 Default options
            const defaultOptions = {
                model: "meta-llama/llama-3.1-8b-instruct:free",
                temperature: 0.7,
                max_tokens: 1000,
                ...options
            };

            // 🚀 Gọi API
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    // 🔐 Sử dụng API key từ environment
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'FPTU Survival Kit'
                },
                body: JSON.stringify({
                    model: defaultOptions.model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: defaultOptions.temperature,
                    max_tokens: defaultOptions.max_tokens
                })
            });

            // 🛡️ Kiểm tra response
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            // ✅ Trả về kết quả
            return {
                success: true,
                content: data.choices[0]?.message?.content || '',
                usage: data.usage
            };

        } catch (error) {
            console.error('❌ OpenRouter API Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 📊 Lấy thông tin models
    async getModels() {
        try {
            if (!this.isConfigured()) {
                throw new Error('OpenRouter API Key không được cấu hình!');
            }

            const response = await fetch(`${this.baseURL}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                models: data.data || []
            };

        } catch (error) {
            console.error('❌ Get Models Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 🔍 Test API key
    async testApiKey() {
        try {
            const result = await this.getModels();
            return {
                valid: result.success,
                message: result.success ? '✅ API Key hợp lệ' : '❌ API Key không hợp lệ',
                error: result.error
            };
        } catch (error) {
            return {
                valid: false,
                message: '❌ Không thể test API key',
                error: error.message
            };
        }
    }
}

// 🚀 Export client instance
const openRouterClient = new OpenRouterClient();

// 📝 Usage Examples:
/*
// ✅ Cách sử dụng AN TOÀN:
async function exampleUsage() {
    // Kiểm tra API key
    if (!openRouterClient.isConfigured()) {
        alert('Vui lòng cấu hình OpenRouter API Key trong file .env.local');
        return;
    }

    // Test API key
    const testResult = await openRouterClient.testApiKey();
    console.log(testResult.message);

    // Gọi chat completion
    const result = await openRouterClient.chatCompletion(
        "Hello, how are you?",
        { model: "meta-llama/llama-3.1-8b-instruct:free" }
    );

    if (result.success) {
        console.log('✅ Response:', result.content);
    } else {
        console.error('❌ Error:', result.error);
    }
}

// ❌ KHÔNG LÀM ĐÂY:
// const apiKey = "your_api_key_here";
// ❌ API key sẽ bị lộ!
*/

// 🚀 Export cho sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OpenRouterClient, openRouterClient };
} else if (typeof window !== 'undefined') {
    window.OpenRouterClient = OpenRouterClient;
    window.openRouterClient = openRouterClient;
}

console.log('🛡️ OpenRouter Client loaded - API Key protected');
