// 🧪 API Test Functions - Testing only
console.log('🔧 API Test Script Loaded');

// Test function to verify API key is loaded
function testApiKey() {
  console.log('🔑 Testing API Key...');
  console.log('Window API Key:', window.OPENROUTER_API_KEY ? '✅ Found' : '❌ Missing');
  
  if (window.OPENROUTER_API_KEY) {
    console.log('API Key starts with:', window.OPENROUTER_API_KEY.substring(0, 10) + '...');
  }
}

// Auto-test on load
testApiKey();
