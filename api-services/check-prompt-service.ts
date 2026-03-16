// 🔍 CHECK PROMPT SERVICE
// Service riêng cho Check Đạo văn AI

import { CHECK_PROMPT_CONFIG } from '../api-config/check-prompt';

export interface CheckRequest {
  prompt: string;
}

export interface CheckResponse {
  analysis?: string;
  suggestions?: string;
  score?: number;
  success: boolean;
  error?: string;
}

export class CheckPromptService {
  // 📤 Kiểm tra và tối ưu prompt
  static async checkPrompt(request: CheckRequest): Promise<CheckResponse> {
    try {
      // 🔍 Kiểm tra API key
      if (!CHECK_PROMPT_CONFIG.isValidKey()) {
        return {
          success: false,
          error: "Check Prompt API key chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_CHECK_PROMPT_API_KEY hoặc NEXT_PUBLIC_OPENROUTER_API_KEY vào file .env.local"
        };
      }

      // 📝 Request body cho OpenRouter
      const requestBody = {
        model: CHECK_PROMPT_CONFIG.MODEL,
        messages: [
          {
            role: "system",
            content: CHECK_PROMPT_CONFIG.CHECK_CONFIG.systemPrompt
          },
          {
            role: "user",
            content: `Prompt cần kiểm tra:\n${request.prompt}\n\nHãy trả về theo format:\n1. Phân tích: [Nội dung phân tích]\n2. Điểm đạo văn (1-10): [Điểm số]\n3. Gợi ý cải thiện: [Nội dung gợi ý]`
          }
        ],
        max_tokens: CHECK_PROMPT_CONFIG.CHECK_CONFIG.maxTokens,
        temperature: CHECK_PROMPT_CONFIG.CHECK_CONFIG.temperature,
      };

      // 🌐 Gọi API OpenRouter
      const response = await fetch(CHECK_PROMPT_CONFIG.getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHECK_PROMPT_CONFIG.API_KEY}`,
          'HTTP-Referer': 'https://fptu-survival-kit.vercel.app',
          'X-Title': 'FPTU Survival Kit'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Check Prompt Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // 📤 Xử lý kết quả (OpenRouter format)
      const result = data.choices?.[0]?.message?.content || '';
      
      // 🎯 Parse kết quả (đơn giản)
      const analysis = result;
      const score = this.extractScore(result);
      const suggestions = this.extractSuggestions(result);
      
      return {
        success: true,
        analysis,
        suggestions,
        score
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi Check Prompt không xác định'
      };
    }
  }

  // 🔢 Trích xuất điểm số từ kết quả
  private static extractScore(text: string): number {
    const match = text.match(/Điểm đạo văn.*?(\d+)/i);
    return match ? parseInt(match[1]) : 5;
  }

  // 💡 Trích xuất gợi ý từ kết quả
  private static extractSuggestions(text: string): string {
    const match = text.match(/Gợi ý cải thiện.*?(.+?)(?=\n\n|$)/i);
    return match ? match[1].trim() : 'Không có gợi ý cụ thể.';
  }
}

// 🎯 Export để dùng dễ dàng
export const { checkPrompt } = CheckPromptService;
