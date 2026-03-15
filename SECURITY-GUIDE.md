# 🔒 Hướng dẫn Bảo mật API Keys

## ✅ **ĐÃ AN TOÀN - KHÔNG BỊ LỘ!**

### 🚫 **Git đã bảo vệ:**
```
.gitignore
├── .env*           # Tất cả environment files
├── .env.local       # File chứa API keys của bạn
├── .env.production  # Production keys
├── .env.development # Development keys
├── firebase-config.json    # Firebase config files
└── serviceAccountKey.json   # Service account keys
```

### 🔍 **Kiểm tra trước khi push:**
```bash
# Kiểm tra có API key nào bị commit không
git grep -r "AIzaSy" -- . ':(exclude).gitignore'

# Hoặc kiểm tra các file nhạy cảm
git ls-files | grep -E "\.(env|key|json)$"
```

### 📋 **Cách hoạt động:**

#### 🔐 **Local Development:**
- **API keys** trong `.env.local` ✅
- **Git ignore** `.env.local` ✅
- **Không bị push** lên GitHub ✅

#### 🚀 **Production:**
- **Environment Variables** set trên Vercel/Netlify
- **Không cần commit** API keys
- **An toàn tuyệt đối**

### 🎯 **Best Practices:**

#### ✅ **NÊN LÀM:**
- ✅ Dùng `.env.local` cho local
- ✅ Set environment variables trên deploy platform
- ✅ Kiểm tra `.gitignore` trước khi push
- ✅ Rotate keys định kỳ

#### ❌ **KHÔNG NÊN LÀM:**
- ❌ Commit `.env.local`
- ❌ Hardcode keys trong code
- ❌ Push keys lên GitHub
- ❌ Share keys công khai

### 🔄 **Nếu lỡ commit keys:**

1. **Remove file**:
   ```bash
   git rm .env.local
   ```

2. **Add to .gitignore**:
   ```bash
   echo ".env.local" >> .gitignore
   ```

3. **Remove from history**:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.local' HEAD
   ```

4. **Force push**:
   ```bash
   git push origin --force --all
   ```

### 🛡️ **Security Checklist:**

- [ ] `.env.local` trong `.gitignore`
- [ ] Không có keys trong source code
- [ ] Environment variables set trên production
- [ ] Keys có hạn chế (restrict domains)
- [ ] Enable monitoring trên Firebase

**🎉 API KEYS CỦA BẠN ĐÃ ĐƯỢC BẢO VỆ!**
