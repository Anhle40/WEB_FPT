# Hướng Dẫn Thiết Lập Đăng Nhập Google với Firebase

## 📋 Tổng Quan
Hướng dẫn này sẽ giúp bạn thiết lập đăng nhập Google cho ứng dụng FPTU Survival Kit sử dụng Firebase Authentication.

## 🔧 Bước 1: Cấu Hình Firebase Console

### 1.1 Tạo Project Firebase
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" hoặc "Tạo dự án"
3. Nhập tên project: `fptu-survival-kit`
4. Chọn Enable Google Analytics (tùy chọn)
5. Click "Create project"

### 1.2 Kích Hoạt Authentication
1. Trong Firebase Console, chọn project của bạn
2. Go to **Authentication** → **Sign-in method**
3. Kích hoạt **Google**:
   - Toggle "Enable"
   - Chọn "Enable" trong popup xác nhận
   - Nhập email hỗ trợ: `support@fptu-survival.com`
   - Click "Save"

### 1.3 Cấu Hình OAuth Consent Screen
1. Go to **Authentication** → **Sign-in method** → **Google**
2. Click "Setup" hoặc "Configure"
3. Trong **OAuth consent screen**:
   - Chọn "External" (nếu chưa có)
   - Nhập thông tin:
     - **App name**: FPTU Survival Kit
     - **User support email**: support@fptu-survival.com
     - **Developer contact information**: support@fptu-survival.com
   - Click "Save and Continue"

### 1.4 Thêm Scopes
Trong **Scopes** section, thêm các scope sau:
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`
- `openid`

### 1.5 Thêm Test Users (nếu cần)
Nếu app đang ở trạng thái testing:
1. Go to **OAuth consent screen** → **Test users**
2. Click "Add users"
3. Thêm email Google của bạn để test

## 🌐 Bước 2: Cấu Hình Web App

### 2.1 Thêm Web App
1. Trong Firebase Console, go to **Project Settings** → **General**
2. Click "Add app" → **Web**
3. Nhập app nickname: `FPTU Survival Kit Web`
4. Click "Register app"

### 2.2 Lấy Firebase Config
Sao chép Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2.3 Cấu Hình Authorized Domains
Trong **Project Settings** → **General** → **Your apps**:
- Thêm domain của bạn vào **Authorized domains**
- Thêm: `localhost`, `127.0.0.1` (cho development)
- Thêm domain production: `your-domain.com`

## 🔐 Bước 3: Cấu Hình Database

### 3.1 Kích Hoạt Realtime Database
1. Go to **Realtime Database** trong Firebase Console
2. Click "Create Database"
3. Chọn location gần nhất (ví dụ: `asia-southeast1`)
4. Chọn "Start in test mode" (cho development)
5. Click "Enable"

### 3.2 Cấu Hình Rules
Trong **Realtime Database** → **Rules**, cập nhật:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 🗝️ Bước 4: Cấu Hình Environment Variables

### 4.1 Tạo file `.env.local`
Trong root directory của project, tạo file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
```

### 4.2 Copy từ Firebase Config
Sao chép các giá trị từ Firebase Config ở Bước 2.2

## 🚀 Bước 5: Kiểm Tra

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Test Đăng Nhập
1. Mở `http://localhost:3000`
2. Click "Đăng nhập với Google"
3. Chọn tài khoản Google
4. Kiểm tra console logs và database

## 🔍 Bước 6: Debug

### 6.1 Common Issues
- **Popup bị chặn**: Enable popup cho localhost
- **OAuth error**: Kiểm tra authorized domains
- **Database permission**: Kiểm tra Firebase rules

### 6.2 Console Logs
Mở Developer Console (F12) và kiểm tra:
- Firebase initialization
- Auth state changes
- Database operations

## 📱 Bước 7: Deployment

### 7.1 Production Domain
1. Thêm production domain vào Firebase authorized domains
2. Cập nhật OAuth consent screen với production URL
3. Publish app (nếu đang ở testing mode)

### 7.2 Environment Variables
Set production environment variables trong hosting platform của bạn.

## 🛠️ Files Đã Thêm

- `lib/firebase.ts` - Firebase configuration và functions
- `components/google-sign-in.tsx` - React component cho Google Sign-In
- `public/firebase-auth.js` - JavaScript functions cho HTML app
- Cập nhật `public/app.html` với Google Sign-In button

## 🎯 Features Đã Implement

- ✅ Đăng nhập với Google popup
- ✅ Lưu user data vào Realtime Database
- ✅ Auto-login khi refresh trang
- ✅ Đăng xuất và cleanup
- ✅ Error handling và notifications
- ✅ UI updates với user info

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra Firebase Console configuration
2. Kiểm tra environment variables
3. Kiểm tra browser console logs
4. Xem lại các steps trong hướng dẫn

---
**Ready to go! 🎉** Google Sign-In đã được tích hợp thành công vào ứng dụng của bạn.
