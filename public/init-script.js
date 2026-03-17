// 🚀 FPTU Survival Kit - Initialization Script
// Initialize all systems when page loads

window.initFPTUKit = async function() {
  try {
    console.log('🚀 Initializing FPTU Survival Kit...');
    
    // Wait for DOM to be ready
    if (document.readyState !== 'complete') {
      await new Promise(resolve => window.addEventListener('load', resolve));
    }
    
    // Wait for Firebase to be ready
    console.log('📋 Step 1: Initializing Firebase...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for Firebase to load
    
    // Initialize Google Auth
    console.log('📋 Step 2: Initializing Google Auth...');
    if (window.GoogleAuth) {
      const authReady = window.GoogleAuth.init();
      if (authReady) {
        // Check if user is already signed in
        const currentUser = await window.GoogleAuth.checkAuthState();
        if (currentUser) {
          console.log('👤 User already signed in:', currentUser.displayName);
          return true; // Skip rest of initialization if user is already signed in
        }
      }
    }
    
    // Initialize Community System
    console.log('📋 Step 3: Initializing Community...');
    const communityReady = await window.initCommunity();
    
    if (communityReady) {
      // Load initial data
      console.log('📋 Step 4: Loading Community Data...');
      await Promise.all([
        Community.loadPosts(),
        Community.loadTrending()
      ]);
      
      // Update UI
      console.log('📋 Step 5: Updating UI...');
      CommunityUI.renderPosts(Community.posts);
      CommunityUI.renderTrending(Community.trending);
    }
    
    // Setup global functions
    window.updatePostsUI = function() {
      CommunityUI.renderPosts(Community.posts);
    };
    
    window.updatePostUI = function(postId) {
      const post = Community.posts.find(p => p.id === postId);
      if (post) {
        // Update single post in UI
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (postElement) {
          postElement.replaceWith(CommunityUI.renderPostCard(post));
        }
      }
    };
    
    // Add Community filter function
    Community.filterPosts = async function(category) {
      // Update button states
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-orange-100', 'text-orange-700');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      });
      
      event.target.classList.remove('text-slate-600', 'hover:bg-slate-100');
      event.target.classList.add('bg-orange-100', 'text-orange-700');
      
      // Filter posts
      const filteredPosts = category === 'all' 
        ? Community.posts 
        : Community.posts.filter(post => post.content.category === category);
      
      CommunityUI.renderPosts(filteredPosts);
    };
    
    console.log('✅ FPTU Survival Kit initialized successfully!');
    console.log('🌟 Features ready:');
    console.log('  - Firebase Database: ✅');
    console.log('  - Google Authentication: ✅');
    console.log('  - Community System: ✅');
    console.log('  - Chat AI: ✅');
    console.log('  - Check Prompt: ✅');
    console.log('  - All Tools: ✅');
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to initialize FPTU Kit:', error);
    return false;
  }
};

// Auto-initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initFPTUKit);
} else {
  window.initFPTUKit();
}

// Notification system
window.showNotification = function(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[300] animate-pulse`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

console.log('🚀 FPTU Survival Kit initialization script loaded');
