# 🔑 VỊ TRÍ ĐIỀN API KEY

## 📁 **FILE DUY NHẤT:**

**`d:\Download\New folder (3)\.env.local`**

## 📝 **NỘI DUNG ĐIỀN:**

### 🔗 **Khi API hết/quá:**

1. **Mở file** `d:\Download\New folder (3)\.env.local`
2. **Tìm dòng** cần thay:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyDLN92oNAfjxPBGYa6FAfraJauaPvE_Zl8
   ```
3. **Thay API key mới** vào:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyNEW_API_KEY_HERE
   ```
4. **Save file**
5. **Refresh browser** (F5)
6. **Test lại**

### 🔥 **Khi Firebase hết/quá:**

1. **Mở file** `.env.local`
2. **Tìm các dòng** Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=fptu-survival-kit
   ```
3. **Thay bằng config mới**
4. **Save file**
5. **Restart server**: `npm run dev`

## 🎯 **Các biến cần biết:**

### 🤖 **AI Keys:**
- `NEXT_PUBLIC_GEMINI_API_KEY` - API key cho Chat AI và Check Prompt
- `NEXT_PUBLIC_CHAT_AI_API_KEY` - API key riêng cho Chat (tùy chọn)
- `NEXT_PUBLIC_CHECK_PROMPT_API_KEY` - API key riêng cho Check Prompt (tùy chọn)

### 🔥 **Firebase Config:**
- `NEXT_PUBLIC_FIREBASE_API_KEY` - API key của Firebase
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Domain của Firebase
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Project ID
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` - Database URL

## 🚨 **LƯU Ý:**

- **KHÔNG BAO GIỜ** hardcode API key vào source code
- **LUÔN DÙNG** file `.env.local`
- **Git sẽ ignore** file này nên an toàn
- **Production** dùng environment variables trên deploy platform

## 🔄 **Quick Fix:**

**API hết? → Mở `.env.local` → Thay key → Save → F5 → Xong!**

**Chỉ cần 1 file là đủ tất cả! 🎯**
