import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth'
import { getDatabase, ref, set, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCnqkftbxic1QGdsV8OqjjtKDzL-4CYJ_0",
  authDomain: "fptu-survival-kit.firebaseapp.com",
  projectId: "fptu-survival-kit",
  storageBucket: "fptu-survival-kit.firebasestorage.app",
  messagingSenderId: "122912571117",
  appId: "1:122912571117:web:cb5bade8d1059f406ed6e4",
  measurementId: "G-FW2PVZ05XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)
const googleProvider = new GoogleAuthProvider()

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Save user data to database
    if (user) {
      const userRef = ref(database, `users/${user.uid}`)
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      // Check if user exists, if not create new user
      const snapshot = await get(userRef)
      if (!snapshot.exists()) {
        await set(userRef, userData)
      } else {
        // Update last login time
        await set(userRef, {
          ...snapshot.val(),
          lastLoginAt: new Date().toISOString()
        })
      }
    }
    
    return user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback)
}

export { auth, database }
