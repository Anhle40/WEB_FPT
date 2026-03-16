// 💬 CHAT AI API CONFIGURATION
// File config riêng cho SOS Chatbot

export const CHAT_AI_CONFIG = {
  // 🔑 API Key cho Chat AI
  API_KEY: process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "",
  
  // 🌐 API Endpoint
  BASE_URL: "https://openrouter.ai/api/v1",
  
  // 📋 Model cho Chat (Gemini 2.5 Flash Lite)
  MODEL: "google/gemini-2.5-flash-lite",
  
  // 🔗 Full API URL
  getApiUrl: () => 
    `https://openrouter.ai/api/v1/chat/completions`,
  
  // ⚙️ Config riêng cho Chat
  CHAT_CONFIG: {
    maxTokens: 1500,
    temperature: 0.8,
    systemPrompt: "Bạn là trợ lý AI FPTU Survival Kit. Hãy trả lời thân thiện, hữu ích cho sinh viên FPTU."
  },
  
  // ✅ Kiểm tra API key
  isValidKey: () => {
    const key = process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    return key && key !== "" && key.startsWith("sk-or-");
  }
};

// 🎯 Export để dùng
export const { API_KEY, BASE_URL, MODEL, getApiUrl, CHAT_CONFIG, isValidKey } = CHAT_AI_CONFIG;
