# 🚀 Hướng dẫn nhanh FPTU Survival Kit

## 1️⃣ Cài đặt Dependencies
```bash
npm install
```

## 2️⃣ Tạo file `.env.local`
Tạo file `.env.local` trong thư mục gốc với nội dung:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Lấy API key tại:** https://aistudio.google.com/app/apikey

## 3️⃣ Chạy project
```bash
npm run dev
```

## 4️⃣ Mở trình duyệt
Vào: http://localhost:3000

---

## 📋 Danh sách tính năng

| Tính năng | Mô tả |
|-----------|------|
| **Login** | Đăng nhập với tên, MSSV, campus, khối ngành |
| **Home** | Trang chủ, truy cập nhanh tất cả tính năng |
| **Wiki Môn học** | Lộ trình 9 kỳ, review môn |
| **Tính điểm Pass** | Tính điểm thi Final cần để pass |
| **Quản lý Deadline** | Ma trận Eisenhower (Urgent/Important) |
| **Check Đạo văn AI** | Check prompt, tối ưu prompt (dùng Gemini) |
| **Cộng đồng** | Newsfeed, post, comment, like, group chat |
| **SOS Chatbot** | Chat với AI (dùng Gemini), hỏi đáp, tâm sự |
| **Cẩm Nang Sinh Tồn** | Tips sống sót, tài chính, kỹ năng, sức khỏe |

---

## 🔧 Cấu hình thêm

### Thay đổi API Key
- Mở file `.env.local`
- Sửa dòng `NEXT_PUBLIC_GEMINI_API_KEY=...`
- Restart server (`npm run dev`)

### Cấu trúc Project
```
/app
  - layout.tsx (layout chính)
  - page.tsx (trang chính - HTML toàn bộ app)
  - globals.css (style CSS)

/lib
  - config.ts (cấu hình API)

.env.local (API Key)
.env.example (template)
SETUP_API.md (hướng dẫn chi tiết)
```

---

## 💡 Lưu ý

- ✅ Tất cả dữ liệu lưu trong `localStorage` (browser storage)
- ✅ Không cần backend, chạy 100% trên frontend
- ✅ API Key trong `.env.local` không được push lên Git
- ⚠️ Nếu quên API Key → Chatbot & Check không hoạt động

---

## 🐛 Xử lý lỗi

| Lỗi | Nguyên nhân | Cách fix |
|-----|-----------|--------|
| "API key chưa được cấu hình" | `.env.local` chưa có NEXT_PUBLIC_GEMINI_API_KEY | Thêm API key vào `.env.local` |
| "Lỗi API" | API key invalid hoặc hết quota | Tạo API key mới tại aistudio.google.com |
| "Mạng yếu hoặc hết tiền API" | Lỗi kết nối hoặc quota | Kiểm tra internet, quota Google API |
| Giao diện không hiển thị | Server không chạy | Chạy `npm run dev` |

---

## 📚 Tài liệu chi tiết

- **SETUP_API.md** - Hướng dẫn cấu hình API key chi tiết
- **lib/config.ts** - File cấu hình centralized
- **.env.example** - Template biến môi trường

Chúc bạn sử dụng vui vẻ! 🎉
