# 🔐 BẢO MẬT API KEYS - HƯỚNG DẪN

## 🚨 TRẠNG THÁI HIỆN TẠI

Trước khi commit code lên GitHub, cần đảm bảo tất cả API keys được bảo mật:

### ❌ **VẤN ĐỀ BẢO MẬT:**
- Firebase API keys bị hardcode trong `app.html`
- Gemini API keys bị hardcode trong `calc_full.txt`
- Environment variables không được sử dụng đúng cách

## 🔧 **CÁCH SỬA ĐÚNG**

### Bước 1: Sử dụng Environment Variables

Tất cả API keys phải được đọc từ environment variables:

```javascript
// ❌ KHÔNG LÀM ĐÂY
const apiKey = "AIzaSyCnqkftbxic1QGdsV8OqjjtKDzL-4CYJ_0";

// ✅ LÀM ĐÂY
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
```

### Bước 2: Cấu hình .env.local

1. Copy file `.env.local.template` thành `.env.local`
2. Điền API keys thật vào file `.env.local`
3. File `.env.local` đã có trong `.gitignore` → sẽ không bị up lên GitHub

### Bước 3: Kiểm tra lại

Chạy lệnh kiểm tra trước khi commit:

```bash
# Kiểm tra có lộ API key không
grep -r "AIzaSy" --exclude-dir=node_modules .
grep -r "sk-or-v1" --exclude-dir=node_modules .

# Không nên thấy kết quả nào
```

## 📋 **DANH SÁCH API KEYS CẦN BẢO MẬT**

### 🔥 Firebase API (Google Login & Community)
- **File**: `.env.local`
- **Variables**:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

### 🤖 Gemini API (Check Prompt & Chat AI)
- **File**: `.env.local`
- **Variables**:
  - `NEXT_PUBLIC_GEMINI_API_KEY`

### 🔗 OpenRouter API (AI Services)
- **File**: `.env.local`
- **Variables**:
  - `NEXT_PUBLIC_OPENROUTER_API_KEY`

## 🛡️ **FIRESTORE RULES**

Đảm bảo Firestore rules ở test mode cho development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 1);
    }
  }
}
```

## ✅ **CHECKLIST TRƯỚC KHI COMMIT**

- [ ] `.env.local` đã có API keys thật
- [ ] Không có API keys hardcode trong source code
- [ ] `grep -r "AIzaSy"` không có kết quả
- [ ] `grep -r "sk-or-v1"` không có kết quả
- [ ] `.gitignore` có bảo vệ file env
- [ ] Test function với environment variables

## 🚀 **SAU KHI BẢO MẬT**

- ✅ An toàn khi up lên GitHub
- ✅ API keys không bị lộ
- ✅ Environment variables hoạt động đúng
- ✅ Development và production tách biệt

## 📞 **HỖ TRỢ**

Nếu gặp lỗi "API key chưa được cấu hình":

1. Kiểm tra file `.env.local` có tồn tại không
2. Kiểm tra biến environment có đúng tên không
3. Restart development server: `npm run dev`
4. Kiểm tra console logs xem có API keys không

**Lưu ý**: Không bao giờ commit file `.env.local` lên GitHub!
