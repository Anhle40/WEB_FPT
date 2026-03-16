// 💬 CHAT AI SERVICE
// Service riêng cho SOS Chatbot

import { CHAT_AI_CONFIG } from '../api-config/chat-ai';

export interface ChatRequest {
  message: string;
  userId?: string;
}

export interface ChatResponse {
  reply?: string;
  success: boolean;
  error?: string;
}

export class ChatAIService {
  // 📤 Gửi tin nhắn đến Chat AI
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // 🔍 Kiểm tra API key
      if (!CHAT_AI_CONFIG.isValidKey()) {
        return {
          success: false,
          error: "Chat AI API key chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_CHAT_AI_API_KEY hoặc NEXT_PUBLIC_OPENROUTER_API_KEY vào file .env.local"
        };
      }

      // 📝 Request body cho OpenRouter
      const requestBody = {
        model: CHAT_AI_CONFIG.MODEL,
        messages: [
          {
            role: "system",
            content: CHAT_AI_CONFIG.CHAT_CONFIG.systemPrompt
          },
          {
            role: "user",
            content: request.message
          }
        ],
        max_tokens: CHAT_AI_CONFIG.CHAT_CONFIG.maxTokens,
        temperature: CHAT_AI_CONFIG.CHAT_CONFIG.temperature,
      };

      // 🌐 Gọi API OpenRouter
      const response = await fetch(CHAT_AI_CONFIG.getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHAT_AI_CONFIG.API_KEY}`,
          'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
          'X-Title': 'FPTU Survival Kit'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Chat AI Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // 📤 Trả về kết quả (OpenRouter format)
      const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
      
      return {
        success: true,
        reply
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi Chat AI không xác định'
      };
    }
  }
}

// 🎯 Export để dùng dễ dàng
export const { sendMessage } = ChatAIService;
