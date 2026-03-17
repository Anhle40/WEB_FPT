// 🧪 Database Test Functions
// Test Firebase Realtime Database connection and operations

window.testDatabase = async function() {
  try {
    console.log('🧪 Testing Firebase Database...');
    
    if (!window.database) {
      console.error('❌ Firebase Database not initialized');
      return false;
    }
    
    // Test write
    const testRef = window.database.ref('test/connection');
    await testRef.set({
      timestamp: new Date().toISOString(),
      message: 'Database connection test successful!',
      status: 'connected'
    });
    
    console.log('✅ Database write test passed');
    
    // Test read
    const snapshot = await testRef.get();
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('✅ Database read test passed:', data);
      
      // Clean up test data
      await testRef.remove();
      console.log('✅ Test data cleaned up');
      
      return true;
    } else {
      console.error('❌ Database read test failed - no data');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
};

// Auto-test on load
setTimeout(() => {
  console.log('🔄 Auto-testing database connection...');
  window.testDatabase();
}, 2000);
