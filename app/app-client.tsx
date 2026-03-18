'use client';

import { useEffect } from 'react';

export default function AppClient() {
  useEffect(() => {
    // 🔐 Set API keys từ environment variable vào window object
    // để HTML inline script có thể truy cập
    (window as any).NEXT_PUBLIC_OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
    
    //  Set Firebase config cho HTML
    (window as any).NEXT_PUBLIC_FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
    (window as any).NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '';
    (window as any).NEXT_PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
    (window as any).NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
    (window as any).NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '';
    (window as any).NEXT_PUBLIC_FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '';
    (window as any).NEXT_PUBLIC_FIREBASE_DATABASE_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '';
    (window as any).NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '';
    
    // Debug: Log API key status
    console.log('🔑 Environment API Keys Status:');
    console.log('- OpenRouter:', process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? '✅ Found' : '❌ Missing');
    console.log('- Firebase:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Found' : '❌ Missing');
    
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
