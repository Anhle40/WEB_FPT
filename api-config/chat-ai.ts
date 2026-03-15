// 💬 CHAT AI API CONFIGURATION
// File config riêng cho SOS Chatbot

export const CHAT_AI_CONFIG = {
  // 🔑 API Key cho Chat AI
  API_KEY: process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  
  // 🌐 API Endpoint
  BASE_URL: "https://generativelanguage.googleapis.com",
  
  // 📋 Model cho Chat
  MODEL: "gemini-2.5-flash",
  
  // 🔗 Full API URL
  getApiUrl: (key: string) => 
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
  
  // ⚙️ Config riêng cho Chat
  CHAT_CONFIG: {
    maxTokens: 1500,
    temperature: 0.8,
    systemPrompt: "Bạn là trợ lý AI FPTU Survival Kit. Hãy trả lời thân thiện, hữu ích cho sinh viên FPTU."
  },
  
  // ✅ Kiểm tra API key
  isValidKey: () => {
    const key = process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    return key && key !== "" && key.startsWith("AIza");
  }
};

// 🎯 Export để dùng
export const { API_KEY, BASE_URL, MODEL, getApiUrl, CHAT_CONFIG, isValidKey } = CHAT_AI_CONFIG;
