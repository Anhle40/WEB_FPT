# 🔥 Hướng dẫn cài đặt Firebase Database

## 📋 Bước 1: Tạo Firebase Project

1. **Truy cập**: https://console.firebase.google.com
2. **Đăng nhập** bằng Google Account
3. **Nhấn "Add project"** → Đặt tên project (VD: `fptu-survival-kit`)
4. **Chọn "Continue"** qua các bước setup
5. **Chờ tạo project** (khoảng 1-2 phút)

## 📊 Bước 2: Bật Realtime Database

1. **Vào menu** → "Build" → "Realtime Database"
2. **Nhấn "Create Database"**
3. **Chọn location** → (VD: `asia-southeast1`)
4. **Chọn "Start in test mode"** (dễ cho development)
5. **Nhấn "Enable"**

## 🔑 Bước 3: Lấy Config

1. **Vào Project Settings** → ⚙️ icon (góc trên trái)
2. **Chọn tab "General"**
3. **Kéo xuống** phần "Your apps"
4. **Nhấn "Web"** icon (</>)
5. **Đặt tên app** → "FPTU Survival Kit"
6. **Nhấn "Register app"**
7. **Copy Firebase config** (dạng object)

## 📝 Bước 4: Điền vào .env.local

Mở file `.env.local` và điền thông tin từ Firebase:

```env
# 🔥 Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (copy từ config)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fptu-survival-kit.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fptu-survival-kit
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fptu-survival-kit.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://fptu-survival-kit-default-rtdb.firebaseio.com
```

## 🚀 Bước 5: Test

1. **Restart server**: `npm run dev`
2. **Mở browser**: http://localhost:3000
3. **Test các tính năng**:
   - ✅ Đăng nhập → dữ liệu lưu vào Firebase
   - ✅ Tính điểm → lịch sử lưu vào Firebase
   - ✅ Deadline → tasks lưu vào Firebase
   - ✅ Cộng đồng → posts/comments lưu vào Firebase

## 🔍 Kiểm tra data

Vào Firebase Console → Realtime Database để xem dữ liệu real-time!

## ✅ Rules cho Production

Khi deploy, vào Rules và đặt:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

**Chúc bạn thành công! 🎉**
