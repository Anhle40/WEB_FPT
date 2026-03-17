// 💬 CHAT AI API CONFIGURATION
// File config riêng cho SOS Chatbot - FPTU AI Assistant

export const CHAT_AI_CONFIG = {
  // 🔑 API Key cho Chat AI
  API_KEY: process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "",
  
  // 🌐 API Endpoint
  BASE_URL: "https://openrouter.ai/api/v1",
  
  // 📋 Model cho Chat (Gemini 2.5 Flash Lite - TIẾT KIỆM)
  MODEL: "google/gemini-2.5-flash-lite",
  
  // 🔗 Full API URL
  getApiUrl: () => 
    `https://openrouter.ai/api/v1/chat/completions`,
  
  // ⚙️ Config riêng cho Chat - TỐI ƯU CHO $5
  CHAT_CONFIG: {
    maxTokens: 250,        // Giảm từ 1500 để tiết kiệm chi phí
    temperature: 0.7,      // Giảm từ 0.8 để ít random hơn
    systemPrompt: `🎓 AI FPTU 2.0 - CHUYÊN GIA, VUI VẺ, TIẾT KIỆM

🔥 CÁCH TRẢ LỜI: Vui vẻ, emoji, ngắn gọn, giải pháp thực tế

📚 FPTU KNOWLEDGE:
• Campus: HN, HCM, DN, CT, QN
• Môn hot: MAD101, PRF192, CSD201, DBI202
• Tech: C++, Java, Python, React, SQL, Git
• Tips: Debug=50% time, GitHub>GPA, Sleep=8h

🍚 FPTU LIFE:
• Cơm tấm 35k cổng sau DN
• Trà sữa 15k giải khát  
• Deadline dí sát nút? Cứ submit!
• SE Week: contest + workshop + party

💡 MISSION: "Người bạn đồng hành FPTU!"`
  },
  
  // ✅ Kiểm tra API key
  isValidKey: () => {
    const key = process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    return key && key !== "" && key.startsWith("sk-or-");
  }
};

// 🎯 Export để dùng
export const { API_KEY, BASE_URL, MODEL, getApiUrl, CHAT_CONFIG, isValidKey } = CHAT_AI_CONFIG;
