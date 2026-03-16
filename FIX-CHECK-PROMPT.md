# 🚀 Hướng dẫn Fix Check Prompt

## ✅ Đã sửa xong các vấn đề:

### 1. **API Route đã được chuẩn hóa**
- ✅ `/api/check-prompt` dùng chung `OPENROUTER_API_KEY` với chat
- ✅ System prompt được cải thiện để trả về HTML format
- ✅ Bảo mật - không lộ API key ở client-side

### 2. **Client-side đã được sửa**
- ✅ `public/prompt-fixed.js` giờ gọi API route thay vì direct API
- ✅ Không cần API key ở client nữa
- ✅ Dùng chung API endpoint với chat

## 🔧 Cần làm để hoạt động:

### **Bước 1: Tạo OpenRouter API Key**
1. Vào: https://openrouter.ai/keys
2. Đăng ký tài khoản (nếu chưa có)
3. Copy API key (bắt đầu bằng `sk-or-v1-`)

### **Bước 2: Setup Environment Variable**
Tạo file `.env.local` trong root project:
```bash
# Thêm API key của bạn vào đây
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

### **Bước 3: Restart Development Server**
```bash
npm run dev
```

## 🎯 Kiểm tra hoạt động:

1. **Mở trình duyệt**: http://localhost:3000
2. **Tìm section Check Prompt**
3. **Nhập prompt test**: "Write a story about a robot"
4. **Bấm nút Check**
5. **Kết quả**: Hiển thị đánh giá và prompt tối ưu

## 🔍 Debug nếu lỗi:

Mở browser console (F12) và tìm:
- `🔍 Starting prompt check via API route...`
- `📊 Response status: 200`
- `💬 AI Reply: [nội dung]`

## 🛡️ Bảo mật:
- ✅ API key chỉ ở server-side
- ✅ Không bị lộ ra client
- ✅ Dùng chung API key cho cả 2 tính năng

**🎉 Check prompt sẽ hoạt động sau khi thêm API key!**
