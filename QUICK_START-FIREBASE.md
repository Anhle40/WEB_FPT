# 🚀 Quick Start với Firebase Database

## 📋 Cần chuẩn bị:

1. **Firebase Account** → https://console.firebase.google.com
2. **Node.js** đã cài đặt
3. **Project đã clone** về máy

## ⚡ 5 bước để có backend:

### 🔥 Bước 1: Tạo Firebase Project (2 phút)
1. Vào https://console.firebase.google.com
2. "Add project" → Đặt tên: `fptu-survival-kit`
3. "Continue" → Chọn location → "Create project"

### 📊 Bước 2: Bật Database (1 phút)
1. Menu → "Build" → "Realtime Database"
2. "Create Database" → Test mode
3. "Enable"

### 🔑 Bước 3: Lấy Config (30 giây)
1. Project Settings ⚙️ → General
2. "Your apps" → Web icon </>
3. Copy Firebase config object

### 📝 Bước 4: Cấu hình (1 phút)
Mở `.env.local` và thêm:

```env
# 🔥 Firebase (thay bằng config của bạn)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fptu-survival-kit.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fptu-survival-kit
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fptu-survival-kit.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://fptu-survival-kit-default-rtdb.firebaseio.com
```

### 🚀 Bước 5: Chạy!
```bash
npm run dev
```

## ✅ Kết quả:

**Dữ liệu sẽ tự động sync:**
- 👤 **User info** → Firebase users/
- 📊 **Calc history** → Firebase calcHistory/
- 📋 **Tasks** → Firebase tasks/
- 📱 **Social posts** → Firebase posts/

**Kiểm tra:** Firebase Console → Realtime Database → Xem data real-time!

## 🎯 Deploy lên production:

1. **Vercel** → `npm run build` → `vercel deploy`
2. **Netlify** → `npm run build` → kéo folder `.next` lên
3. **Firebase Hosting** → `firebase init` → `firebase deploy`

## 🆘 Hỗ trợ:

- 📖 **Docs chi tiết**: `api-config/README-FIREBASE.md`
- 🔧 **Config files**: `api-config/firebase.ts`
- 🤖 **Service**: `api-services/firebase-service.ts`

**Chúc bạn thành công! 🎉**
