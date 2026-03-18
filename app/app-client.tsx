'use client';

import { useEffect } from 'react';

export default function AppClient() {
  useEffect(() => {
    // 🔐 KHÔNG set bất kỳ API key nào ra frontend!
    // Firebase config sẽ được đọc trực tiếp từ environment khi cần
    
    // Debug: Log status
    console.log('🔑 Environment API Keys Status:');
    console.log('- OpenRouter: ❌ Hidden for security');
    console.log('- Firebase: ✅ Using environment variables');
    
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/app.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        title="FPTU Survival Kit App"
      />
    </div>
  );
}
