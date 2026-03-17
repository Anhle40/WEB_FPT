// 🔐 Google Authentication System - Simplified
// Direct Firebase Auth integration

window.GoogleAuth = {
  // Firebase Auth instance
  auth: null,
  provider: null,
  
  // Initialize Google Auth
  init: function() {
    try {
      console.log('🔐 Initializing Google Auth...');
      
      // Wait for Firebase to be ready
      if (!window.firebaseApp) {
        console.error('❌ Firebase app not initialized');
        return false;
      }
      
      // Use compat Firebase Auth
      if (typeof firebase !== 'undefined' && firebase.auth) {
        this.auth = firebase.auth();
        this.provider = new firebase.auth.GoogleAuthProvider();
        
        // Configure provider
        this.provider.setCustomParameters({
          prompt: 'select_account'
        });
        
        // Set up auth state listener
        this.auth.onAuthStateChanged((user) => {
          console.log('🔄 Auth state changed:', user ? 'User signed in' : 'User signed out');
          if (user) {
            this.handleSuccessfulAuth(user);
          } else {
            this.handleSignOut();
          }
        });
        
        console.log('✅ Google Auth initialized successfully');
        return true;
      } else {
        console.error('❌ Firebase Auth compat not available');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize Google Auth:', error);
      return false;
    }
  },
  
  // Sign in with Google
  signIn: async function() {
    try {
      console.log('🔐 Initiating Google Sign-In...');
      
      // Show loading state
      this.updateSignInUI('loading');
      
      // Sign in with popup
      const result = await this.auth.signInWithPopup(this.provider);
      
      console.log('✅ Google Sign-In successful:', result.user);
      return result.user;
      
    } catch (error) {
      console.error('❌ Google Sign-In failed:', error);
      this.handleSignInError(error);
      throw error;
    }
  },
  
  // Sign out
  signOut: async function() {
    try {
      await this.auth.signOut();
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
    }
  },
  
  // Handle successful authentication
  handleSuccessfulAuth: async function(user) {
    try {
      console.log('👤 Handling successful auth for:', user.displayName);
      
      // Create user profile
      const userProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Save to Firebase Database
      if (window.database) {
        const userRef = window.database.ref(`users/${user.uid}`);
        await userRef.set({
          profile: userProfile,
          stats: {
            postsCount: 0,
            commentsCount: 0,
            likesGiven: 0,
            likesReceived: 0,
            helpfulVotes: 0
          },
          settings: {
            notifications: true,
            emailAlerts: true,
            privacy: 'public'
          }
        });
        
        // Update last active
        await userRef.child('profile/lastActive').set(firebase.database.ServerValue.TIMESTAMP);
      }
      
      // Save to localStorage
      localStorage.setItem('fptu_user_session', JSON.stringify(userProfile));
      
      // Update Community current user
      if (window.Community) {
        window.Community.currentUser = userProfile;
      }
      
      // Update UI
      this.updateSignInUI('success');
      this.updateUserProfileUI(userProfile);
      
      // Show welcome notification
      if (window.showNotification) {
        window.showNotification(`🎉 Chào mừng ${user.displayName}!`, 'success');
      }
      
      // Redirect to main app
      setTimeout(() => {
        if (window.showView) {
          window.showView('dashboard');
        }
      }, 1500);
      
    } catch (error) {
      console.error('❌ Failed to handle successful auth:', error);
    }
  },
  
  // Handle sign out
  handleSignOut: function() {
    console.log('👋 User signed out');
    
    // Clear localStorage
    localStorage.removeItem('fptu_user_session');
    
    // Update Community current user
    if (window.Community) {
      window.Community.currentUser = null;
    }
    
    // Update UI
    this.updateSignInUI('idle');
    this.updateUserProfileUI(null);
    
    // Show sign-in view
    if (window.showView) {
      window.showView('login');
    }
  },
  
  // Handle sign in errors
  handleSignInError: function(error) {
    let errorMessage = 'Đăng nhập thất bại';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Đã hủy đăng nhập';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup bị chặn, vui lòng cho phép popup';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Đã hủy yêu cầu đăng nhập';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Lỗi kết nối mạng';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Quá nhiều yêu cầu, vui lòng thử lại sau';
        break;
      default:
        errorMessage = error.message || 'Đăng nhập thất bại';
    }
    
    this.updateSignInUI('error', errorMessage);
    
    if (window.showNotification) {
      window.showNotification(errorMessage, 'error');
    }
  },
  
  // Update sign-in UI
  updateSignInUI: function(state, message = '') {
    const button = document.getElementById('google-signin-btn');
    const loadingElement = document.getElementById('signin-loading');
    const errorElement = document.getElementById('signin-error');
    
    if (!button) return;
    
    switch (state) {
      case 'idle':
        button.innerHTML = `
          <div class="flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="font-medium">Đăng nhập với Google</span>
          </div>
        `;
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
        break;
        
      case 'loading':
        button.innerHTML = `
          <div class="flex items-center justify-center gap-3">
            <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span class="font-medium">Đang đăng nhập...</span>
          </div>
        `;
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
        break;
        
      case 'success':
        button.innerHTML = `
          <div class="flex items-center justify-center gap-3">
            <i class="fas fa-check-circle text-white"></i>
            <span class="font-medium">Đăng nhập thành công!</span>
          </div>
        `;
        break;
        
      case 'error':
        button.innerHTML = `
          <div class="flex items-center justify-center gap-3">
            <i class="fas fa-exclamation-triangle text-white"></i>
            <span class="font-medium">Thử lại</span>
          </div>
        `;
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
        
        if (errorElement) {
          errorElement.textContent = message;
          errorElement.classList.remove('hidden');
        }
        break;
    }
  },
  
  // Update user profile UI
  updateUserProfileUI: function(user) {
    const profileElements = document.querySelectorAll('[data-user-profile]');
    
    profileElements.forEach(element => {
      if (user) {
        // Update with user info
        const nameElement = element.querySelector('[data-user-name]');
        const avatarElement = element.querySelector('[data-user-avatar]');
        const emailElement = element.querySelector('[data-user-email]');
        
        if (nameElement) nameElement.textContent = user.name;
        if (avatarElement) avatarElement.src = user.avatar;
        if (emailElement) emailElement.textContent = user.email;
        
        element.classList.remove('hidden');
      } else {
        // Hide user info
        element.classList.add('hidden');
      }
    });
  },
  
  // Check if user is already signed in
  checkAuthState: function() {
    return new Promise((resolve) => {
      if (!this.auth) {
        resolve(null);
        return;
      }
      
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
};

console.log('🔐 Google Authentication System loaded');
