# 🔑 Hướng dẫn điền API Keys

## 📁 **FILE DUY NHẤT CẦN ĐIỀN:**

### 🎯 **`.env.local`**
```
📍 Đường dẫn: d:\Download\New folder (3)\.env.local
🔒 Bảo mật: Đã có trong .gitignore
🚫 Git sẽ KHÔNG push file này
```

## 📝 **Nội dung cần điền:**

### 🔗 **1. Gemini API Key (BẮT BUỘC)**
```env
# Lấy tại: https://aistudio.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyDLN92oNAfjxPBGYa6FAfraJauaPvE_Zl8
```

### 🔥 **2. Firebase Config (để deploy)**
```env
# Lấy tại: https://console.firebase.google.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fptu-survival-kit.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fptu-survival-kit
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fptu-survival-kit.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://fptu-survival-kit-default-rtdb.firebaseio.com
```

## 🚀 **Các bước:**

### Bước 1: Tạo file `.env.local`
1. **Copy** nội dung trên
2. **Paste** vào file mới: `.env.local`
3. **Save** tại thư mục gốc

### Bước 2: Điền Gemini API Key
1. **Truy cập**: https://aistudio.google.com/app/apikey
2. **"Create API key"**
3. **Copy** key (bắt đầu `AIzaSy...`)
4. **Paste** vào `NEXT_PUBLIC_GEMINI_API_KEY=`

### Bước 3: Điền Firebase (nếu deploy)
1. **Truy cập**: https://console.firebase.google.com
2. **"Add project"** → Đặt tên: `fptu-survival-kit`
3. **Realtime Database** → "Create Database"
4. **Project Settings** → Copy config
5. **Paste** vào các biến Firebase

## ✅ **Kiểm tra:**

```bash
# Test app chạy
npm run dev

# Kiểm tra API key có hoạt động
# Mở browser → Test Chat AI và Check Prompt
```

## 🔒 **Bảo mật:**

- ✅ `.env.local` đã trong `.gitignore`
- ✅ GitHub sẽ không bao giờ thấy keys
- ✅ Production dùng environment variables
- ✅ AN TOÀN BẢO MẬT!

## 🎯 **Tóm lại:**

**Chỉ cần điền 1 file `.env.local` là đủ!**

🔑 **Keys**: `.env.local`
🚫 **Git ignore`: `.gitignore` 
🚀 **Deploy**: Environment variables

**AN TOÀN! 🎉**
