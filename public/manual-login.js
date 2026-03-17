// 🔧 Manual Login Functions
// Fallback login system when Google Auth is not available

window.showManualLogin = function() {
  const googleForm = document.querySelector('.auth-card');
  const manualForm = document.getElementById('manual-login-form');
  
  if (googleForm && manualForm) {
    googleForm.classList.add('hidden');
    manualForm.classList.remove('hidden');
  }
};

window.hideManualLogin = function() {
  const googleForm = document.querySelector('.auth-card');
  const manualForm = document.getElementById('manual-login-form');
  
  if (googleForm && manualForm) {
    manualForm.classList.add('hidden');
    googleForm.classList.remove('hidden');
  }
};

window.handleLogin = function() {
  try {
    const fullname = document.getElementById('fullname').value;
    const mssv = document.getElementById('mssv').value;
    const campus = document.getElementById('campus').value;
    const faculty = document.getElementById('faculty').value;
    
    // Validate inputs
    if (!fullname || !mssv || !campus) {
      if (window.showNotification) {
        window.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
      }
      return;
    }
    
    // Create user profile
    const userProfile = {
      uid: mssv,
      name: fullname,
      mssv: mssv,
      campus: campus,
      faculty: faculty || 'Chưa chọn',
      avatar: '/placeholder-user.jpg',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    // Save to Firebase Database
    if (window.database) {
      const userRef = window.database.ref(`users/${mssv}`);
      userRef.set({
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
      }).then(() => {
        console.log('✅ Manual login successful');
        
        // Save to localStorage
        localStorage.setItem('fptu_user_session', JSON.stringify(userProfile));
        
        // Update Community current user
        if (window.Community) {
          window.Community.currentUser = userProfile;
        }
        
        // Show success message
        if (window.showNotification) {
          window.showNotification(`🎉 Chào mừng ${fullname}!`, 'success');
        }
        
        // Redirect to main app
        setTimeout(() => {
          if (window.showView) {
            window.showView('dashboard');
          }
        }, 1000);
        
      }).catch(error => {
        console.error('❌ Failed to save user data:', error);
        if (window.showNotification) {
          window.showNotification('Đăng nhập thất bại, vui lòng thử lại', 'error');
        }
      });
    } else {
      // Fallback to localStorage only
      localStorage.setItem('fptu_user_session', JSON.stringify(userProfile));
      
      if (window.showNotification) {
        window.showNotification(`🎉 Chào mừng ${fullname}!`, 'success');
      }
      
      setTimeout(() => {
        if (window.showView) {
          window.showView('dashboard');
        }
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Manual login error:', error);
    if (window.showNotification) {
      window.showNotification('Đăng nhập thất bại', 'error');
    }
  }
};

console.log('🔧 Manual Login Functions loaded');
