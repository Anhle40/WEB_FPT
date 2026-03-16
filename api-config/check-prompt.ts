// 🔍 CHECK PROMPT API CONFIGURATION  
// File config riêng cho Check Đạo văn AI

export const CHECK_PROMPT_CONFIG = {
  // 🔑 API Key cho Check Prompt
  API_KEY: process.env.NEXT_PUBLIC_CHECK_PROMPT_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "",
  
  // 🌐 API Endpoint
  BASE_URL: "https://openrouter.ai/api/v1",
  
  // 📋 Model cho Check (Gemini 2.5 Flash Lite)
  MODEL: "google/gemini-2.5-flash-lite",
  
  // 🔗 Full API URL
  getApiUrl: () => 
    `https://openrouter.ai/api/v1/chat/completions`,
  
  // ⚙️ Config riêng cho Check
  CHECK_CONFIG: {
    maxTokens: 1000,
    temperature: 0.3,
    systemPrompt: "Hãy phân tích và tối ưu prompt sau để tránh đạo văn AI. Đưa ra gợi ý cải thiện."
  },
  
  // ✅ Kiểm tra API key
  isValidKey: () => {
    const key = process.env.NEXT_PUBLIC_CHECK_PROMPT_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    return key && key !== "" && key.startsWith("sk-or-");
  }
};

// 🎯 Export để dùng
export const { API_KEY, BASE_URL, MODEL, getApiUrl, CHECK_CONFIG, isValidKey } = CHECK_PROMPT_CONFIG;
