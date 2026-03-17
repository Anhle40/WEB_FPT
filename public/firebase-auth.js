// Firebase Configuration
const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY || "AIzaSyCQUBMtNTl6AJoeLmHmGmH_v5eIiJcMXPQ",
  authDomain: window.FIREBASE_AUTH_DOMAIN || "anh-3ec3f.firebaseapp.com",
  projectId: window.FIREBASE_PROJECT_ID || "anh-3ec3f",
  storageBucket: window.FIREBASE_STORAGE_BUCKET || "anh-3ec3f.firebasestorage.app",
  messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "791025660502",
  appId: window.FIREBASE_APP_ID || "1:791025660502:web:fc9d5c9a97a34f8b1341f7",
  databaseURL: window.FIREBASE_DATABASE_URL || "https://anh-3ec3f-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

// Google Sign-In Function
window.handleGoogleSignIn = async function() {
  const button = document.getElementById('google-signin-btn');
  const originalContent = button.innerHTML;
  const originalClasses = button.className;
  
  try {
    // Show loading state with beautiful animation
    button.innerHTML = `
      <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="animate-pulse">Đang kết nối...</span>
    `;
    button.className = originalClasses + ' google-signin-loading';
    button.disabled = true;
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Google Auth Provider
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Sign in with popup
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    console.log('🎉 Google sign-in successful:', user);
    
    // Save user data to database
    if (user) {
      const userRef = database.ref(`users/${user.uid}`);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        lastLoginAt: firebase.database.ServerValue.TIMESTAMP
      };
      
      // Check if user exists, if not create new user
      const snapshot = await userRef.once('value');
      if (!snapshot.exists()) {
        await userRef.set(userData);
        console.log('✨ New user created in database');
      } else {
        // Update last login time
        await userRef.update({
          lastLoginAt: firebase.database.ServerValue.TIMESTAMP
        });
        console.log('🔄 Existing user login time updated');
      }
      
      // Store user data in localStorage for the app
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        loginMethod: 'google'
      }));
      
      // Update UI and show main app
      updateUserInfo(user);
      showMainApp();
    }
    
  } catch (error) {
    console.error('❌ Google sign-in error:', error);
    
    // Show error message with better UX
    let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Đăng nhập bị hủy.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup bị chặn. Vui lòng cho phép popup và thử lại.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Đăng nhập bị hủy.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau.';
    }
    
    // Show error notification
    showNotification(errorMessage, 'error');
    
    // Restore button with animation
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.className = originalClasses;
      button.disabled = false;
    }, 300);
  }
};

// Update user info in UI
function updateUserInfo(user) {
  // Lấy thông tin user cũ để merge với Google user
  const oldSession = localStorage.getItem('fptu_user_session');
  let oldUserData = {};
  
  if (oldSession) {
    try {
      oldUserData = JSON.parse(oldSession);
    } catch (e) {
      console.warn('Failed to parse old session data');
    }
  }
  
  // Merge Google user với user data cũ
  const mergedUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    loginMethod: 'google',
    // Preserve old data if exists
    name: user.displayName || oldUserData.name || '',
    campus: oldUserData.campus || 'Đà Nẵng', // Default campus
    faculty: oldUserData.faculty || '',
    avatar: user.photoURL || oldUserData.avatar || null
  };
  
  // Update welcome message
  const welcomeName = document.getElementById('welcome-name');
  if (welcomeName) {
    welcomeName.textContent = mergedUser.name;
  }
  
  // Update welcome campus and faculty
  const welcomeCampus = document.getElementById('welcome-campus');
  if (welcomeCampus) {
    welcomeCampus.textContent = mergedUser.campus;
  }
  
  const welcomeFaculty = document.getElementById('welcome-faculty');
  if (welcomeFaculty) {
    const facultyText = mergedUser.faculty ? getFacultyText(mergedUser.faculty) : '--';
    welcomeFaculty.textContent = facultyText;
  }
  
  // Update sidebar user info
  const sidebarUsername = document.getElementById('sidebar-username');
  if (sidebarUsername) {
    sidebarUsername.textContent = mergedUser.name;
  }
  
  const sidebarUserInfo = document.getElementById('sidebar-user-info');
  if (sidebarUserInfo) {
    const infoText = mergedUser.faculty ? getFacultyText(mergedUser.faculty) : 'FPTU';
    sidebarUserInfo.textContent = infoText;
  }
  
  // Update user avatar
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) {
    if (mergedUser.photoURL) {
      sidebarAvatar.style.backgroundImage = `url(${mergedUser.photoURL})`;
      sidebarAvatar.style.backgroundSize = 'cover';
      sidebarAvatar.style.backgroundPosition = 'center';
      sidebarAvatar.textContent = '';
    } else if (mergedUser.avatar) {
      sidebarAvatar.innerHTML = `<img src="${mergedUser.avatar}" class="w-full h-full rounded-full object-cover">`;
    } else if (mergedUser.name) {
      const initials = mergedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      sidebarAvatar.textContent = initials;
      sidebarAvatar.style.backgroundImage = '';
    }
  }
  
  // Update all user avatar displays
  const setAvatarElem = e => {
    if (mergedUser.photoURL) {
      e.style.backgroundImage = `url(${mergedUser.photoURL})`;
      e.style.backgroundSize = 'cover';
      e.style.backgroundPosition = 'center';
      e.textContent = '';
    } else if (mergedUser.avatar) {
      e.innerHTML = `<img src="${mergedUser.avatar}" class="w-full h-full rounded-full object-cover">`;
    } else {
      e.innerText = mergedUser.name.charAt(0).toUpperCase();
      e.style.backgroundImage = '';
    }
  };
  document.querySelectorAll('.user-avt-display').forEach(setAvatarElem);
  
  // Update header avatar if exists
  const headerAvt = document.getElementById('header-avt');
  if(headerAvt) setAvatarElem(headerAvt);
  
  // Update local badge
  const localBadge = document.getElementById('local-badge');
  if(localBadge) localBadge.innerText = mergedUser.campus.substring(0,2).toUpperCase();
  
  // Update campus display
  const campusDisplay = document.getElementById('current-campus-display');
  if(campusDisplay) campusDisplay.innerText = mergedUser.campus;
  
  // **QUAN TRỌNG**: Cập nhật global currentUser để AI functions hoạt động đúng
  if (typeof currentUser !== 'undefined') {
    currentUser.name = mergedUser.name;
    currentUser.campus = mergedUser.campus;
    currentUser.faculty = mergedUser.faculty;
    currentUser.avatar = mergedUser.avatar;
  }
  
  // Lưu merged user data vào localStorage cho cả hai hệ thống
  localStorage.setItem('currentUser', JSON.stringify({
    uid: mergedUser.uid,
    email: mergedUser.email,
    displayName: mergedUser.displayName,
    photoURL: mergedUser.photoURL,
    loginMethod: 'google'
  }));
  
  localStorage.setItem('fptu_user_session', JSON.stringify({
    name: mergedUser.name,
    campus: mergedUser.campus,
    faculty: mergedUser.faculty,
    avatar: mergedUser.avatar
  }));
  
  console.log('✅ User info updated and merged successfully');
}

// Helper function to get faculty text
function getFacultyText(faculty) {
  const facultyMap = {
    'IT_FACULTY': '🖥️ Khối Công nghệ Thông tin',
    'BUSINESS_FACULTY': '💼 Khối Kinh doanh & Quản trị',
    'DESIGN_FACULTY': '🎨 Khối Thiết kế',
    'MULTIMEDIA_FACULTY': '🎬 Khối Đa phương tiện',
    'LANGUAGES_FACULTY': '🌍 Khối Ngôn ngữ',
    'ARCHITECTURE_FACULTY': '🏗️ Khối Kiến trúc'
  };
  return facultyMap[faculty] || faculty;
}

// Show main app
function showMainApp() {
  const loginScreen = document.getElementById('login-screen');
  const mainApp = document.getElementById('main-app');
  
  if (loginScreen) loginScreen.style.display = 'none';
  if (mainApp) mainApp.classList.remove('hidden');
  
  // Show success notification
  showNotification('Đăng nhập thành công!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element with beautiful styling
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-[200] animate-slideUp notification-${type} min-w-[300px] max-w-md`;
  
  // Add icon based on type
  let icon = '';
  if (type === 'success') {
    icon = '<i class="fa-solid fa-check-circle mr-2"></i>';
  } else if (type === 'error') {
    icon = '<i class="fa-solid fa-exclamation-circle mr-2"></i>';
  } else {
    icon = '<i class="fa-solid fa-info-circle mr-2"></i>';
  }
  
  notification.innerHTML = `
    <div class="flex items-center text-white font-medium">
      ${icon}
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add entrance animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after 4 seconds with exit animation
  setTimeout(() => {
    notification.classList.add('animate-slideDown');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Listen to auth state changes
auth.onAuthStateChanged(function(user) {
  if (user) {
    console.log('🔥 User is signed in with Google:', user);
    
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      // Store user data
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        loginMethod: 'google'
      }));
    }
    
    // Update UI - merge với existing data
    updateUserInfo(user);
    
    // If we're on login screen, show main app
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    if (loginScreen && loginScreen.style.display !== 'none' && mainApp) {
      showMainApp();
    }
  } else {
    console.log('👋 User is signed out');
    localStorage.removeItem('currentUser');
    // Không xóa fptu_user_session ở đây để preserve regular login data
  }
});

// Sign out function
window.handleGoogleSignOut = async function() {
  try {
    await auth.signOut();
    
    // Xóa cả hai loại session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('fptu_user_session');
    
    // Show login screen
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    
    if (loginScreen) loginScreen.style.display = 'flex';
    if (mainApp) mainApp.classList.add('hidden');
    
    // Reset global currentUser nếu tồn tại
    if (typeof currentUser !== 'undefined') {
      currentUser = { name: '', campus: '', faculty: '', avatar: '' };
    }
    
    showNotification('Đăng xuất thành công!', 'success');
  } catch (error) {
    console.error('Sign out error:', error);
    showNotification('Đăng xuất thất bại. Vui lòng thử lại.', 'error');
  }
};

console.log('Firebase Auth initialized');
