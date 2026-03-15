// 🔥 FIREBASE CONFIGURATION
// Database backend cho FPTU Survival Kit

export const FIREBASE_CONFIG = {
  // 🔑 Firebase Config - Thay bằng config của bạn
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your_firebase_api_key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
  
  // 📊 Database URLs
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://your-project-id-default-rtdb.firebaseio.com",
  
  // ✅ Kiểm tra Firebase config
  isValidConfig: () => {
    const config = FIREBASE_CONFIG;
    return config.apiKey !== "your_firebase_api_key" && 
           config.projectId !== "your-project-id";
  }
};

// 🎯 Export để dùng
export const { 
  apiKey, 
  authDomain, 
  projectId, 
  storageBucket, 
  messagingSenderId, 
  appId, 
  databaseURL, 
  isValidConfig 
} = FIREBASE_CONFIG;
