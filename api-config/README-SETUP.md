# 🚀 Hướng dẫn cài đặt API Key

## 📝 3 cách để điền API key:

### 🔥 Cách 1: Dùng 1 API key cho cả 2 tính năng (Khuyến nghị)
Mở file `.env.local` và thêm:
```env
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBYUPXC8F1KulUC11e_TXBE8vxR0wcMeks
```

### 💬 Cách 2: API key riêng cho Chat AI
```env
NEXT_PUBLIC_CHAT_AI_API_KEY=AIzaSyBYUPXC8F1KulUC11e_TXBE8vxR0wcMeks
```

### 🔍 Cách 3: API key riêng cho Check Prompt  
```env
NEXT_PUBLIC_CHECK_PROMPT_API_KEY=AIzaSyBYUPXC8F1KulUC11e_TXBE8vxR0wcMeks
```

## 📁 File config tương ứng:

| Tính năng | Config file | Service file | Environment variable |
|-----------|-------------|--------------|---------------------|
| **SOS Chatbot** | `api-config/chat-ai.ts` | `api-services/chat-ai-service.ts` | `NEXT_PUBLIC_CHAT_AI_API_KEY` |
| **Check Đạo văn** | `api-config/check-prompt.ts` | `api-services/check-prompt-service.ts` | `NEXT_PUBLIC_CHECK_PROMPT_API_KEY` |

## 🎯 Cách dùng trong component:

### Chat AI Component:
```typescript
import { ChatAIService } from '../api-services/chat-ai-service';

const handleChat = async (message: string) => {
  const response = await ChatAIService.sendMessage({ message });
  if (response.success) {
    console.log(response.reply);
  }
};
```

### Check Prompt Component:
```typescript
import { CheckPromptService } from '../api-services/check-prompt-service';

const handleCheck = async (prompt: string) => {
  const response = await CheckPromptService.checkPrompt({ prompt });
  if (response.success) {
    console.log(response.analysis);
  }
};
```

## ✅ Lưu ý:
- Nếu không điền API key riêng, hệ thống sẽ tự động dùng `NEXT_PUBLIC_GEMINI_API_KEY`
- API key lấy từ: https://aistudio.google.com/app/apikey
- Restart server sau khi thay đổi `.env.local`
