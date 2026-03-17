// 🔥 Global Configuration - Unified for both Next.js and Static HTML
// This file is loaded by both systems

window.GLOBAL_CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyCQUBMtNTl6AJoeLmHmGmH_v5eIiJcMXPQ",
    authDomain: "anh-3ec3f.firebaseapp.com",
    projectId: "anh-3ec3f",
    storageBucket: "anh-3ec3f.firebasestorage.app",
    messagingSenderId: "791025660502",
    appId: "1:791025660502:web:fc9d5c9a97a34f8b1341f7",
    measurementId: "G-6CKF33964S",
    databaseURL: "https://anh-3ec3f-default-rtdb.firebaseio.com/"
  },
  
  // API Configuration
  api: {
    openrouter: "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",
    baseUrl: "http://localhost:3000/api"
  }
};

// Make available globally
console.log('🔧 Global configuration loaded');
