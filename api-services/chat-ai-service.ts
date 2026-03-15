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
          error: "Chat AI API key chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_CHAT_AI_API_KEY hoặc NEXT_PUBLIC_GEMINI_API_KEY vào file .env.local"
        };
      }

      // 📝 Chuẩn bị prompt đầy đủ
      const fullPrompt = `${CHAT_AI_CONFIG.CHAT_CONFIG.systemPrompt}\n\nCâu hỏi từ sinh viên: ${request.message}`;

      // 📝 Request body
      const requestBody = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: CHAT_AI_CONFIG.CHAT_CONFIG.maxTokens,
          temperature: CHAT_AI_CONFIG.CHAT_CONFIG.temperature,
        }
      };

      // 🌐 Gọi API
      const response = await fetch(CHAT_AI_CONFIG.getApiUrl(CHAT_AI_CONFIG.API_KEY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Chat AI Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // 📤 Trả về kết quả
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
      
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
