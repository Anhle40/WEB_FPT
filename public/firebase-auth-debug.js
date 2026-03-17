// 🧪 Firebase Auth Debug Tool
// Debug Google Sign-In issues

window.debugFirebaseAuth = function() {
  console.log('🔍 Firebase Auth Debug Report:');
  console.log('================================');
  
  // Check Firebase availability
  console.log('📋 Firebase Status:');
  console.log('- Firebase App:', !!window.firebaseApp);
  console.log('- Firebase Database:', !!window.database);
  console.log('- Firebase Auth Functions:', !!window.firebase?.auth);
  console.log('- Google Provider:', !!window.firebase?.GoogleAuthProvider);
  
  // Check Google Auth
  console.log('📋 Google Auth Status:');
  console.log('- GoogleAuth Object:', !!window.GoogleAuth);
  console.log('- Auth Instance:', !!window.GoogleAuth?.auth);
  console.log('- Provider:', !!window.GoogleAuth?.provider);
  
  // Check Firebase Config
  console.log('📋 Firebase Config:');
  if (window.GLOBAL_CONFIG?.firebase) {
    const config = window.GLOBAL_CONFIG.firebase;
    console.log('- API Key:', config.apiKey ? '✅ Set' : '❌ Missing');
    console.log('- Auth Domain:', config.authDomain || '❌ Missing');
    console.log('- Project ID:', config.projectId || '❌ Missing');
    console.log('- Database URL:', config.databaseURL || '❌ Missing');
  } else {
    console.log('❌ Firebase config not found');
  }
  
  // Test Firebase Auth initialization
  console.log('📋 Testing Auth Init:');
  try {
    if (window.GoogleAuth) {
      const result = window.GoogleAuth.init();
      console.log('- Init Result:', result ? '✅ Success' : '❌ Failed');
    } else {
      console.log('❌ GoogleAuth not available');
    }
  } catch (error) {
    console.log('❌ Init Error:', error.message);
  }
  
  console.log('================================');
  console.log('🔧 Manual Test Options:');
  console.log('1. Check Firebase Console: https://console.firebase.google.com/project/anh-3ec3f/authentication');
  console.log('2. Enable Google Sign-In Provider');
  console.log('3. Add authorized domains (localhost:3000, anh-3ec3f.web.app)');
  console.log('4. Check OAuth consent screen configuration');
};

// Auto-run debug on page load
setTimeout(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🧪 Running Firebase Auth Debug...');
    window.debugFirebaseAuth();
  }
}, 3000);

console.log('🧪 Firebase Auth Debug Tool loaded');
