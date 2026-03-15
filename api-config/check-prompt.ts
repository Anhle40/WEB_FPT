// 🔍 CHECK PROMPT API CONFIGURATION  
// File config riêng cho Check Đạo văn AI

export const CHECK_PROMPT_CONFIG = {
  // 🔑 API Key cho Check Prompt
  API_KEY: process.env.NEXT_PUBLIC_CHECK_PROMPT_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  
  // 🌐 API Endpoint
  BASE_URL: "https://generativelanguage.googleapis.com",
  
  // 📋 Model cho Check
  MODEL: "gemini-2.5-flash",
  
  // 🔗 Full API URL
  getApiUrl: (key: string) => 
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
  
  // ⚙️ Config riêng cho Check
  CHECK_CONFIG: {
    maxTokens: 1000,
    temperature: 0.3,
    systemPrompt: "Hãy phân tích và tối ưu prompt sau để tránh đạo văn AI. Đưa ra gợi ý cải thiện."
  },
  
  // ✅ Kiểm tra API key
  isValidKey: () => {
    const key = process.env.NEXT_PUBLIC_CHECK_PROMPT_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    return key && key !== "" && key.startsWith("AIza");
  }
};

// 🎯 Export để dùng
export const { API_KEY, BASE_URL, MODEL, getApiUrl, CHECK_CONFIG, isValidKey } = CHECK_PROMPT_CONFIG;
