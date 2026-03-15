// 🔥 FIREBASE SERVICE
// Service xử lý database operations

import { FIREBASE_CONFIG } from '../api-config/firebase';

// 📝 Data types
export interface User {
  id: string;
  fullname: string;
  mssv: string;
  campus: string;
  faculty: string;
  createdAt: string;
  lastLogin: string;
}

export interface CalcHistory {
  id: string;
  userId: string;
  total: number;
  date: string;
  subject?: string;
}

export interface EisenhowerTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  urgency: 'high' | 'low';
  importance: 'high' | 'low';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  author: string;
  content: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  author: string;
  content: string;
  createdAt: string;
}

export class FirebaseService {
  // 🔥 Initialize Firebase
  static initializeApp() {
    if (typeof window !== 'undefined' && !window.firebaseApp) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js';
      script.onload = () => {
        const dbScript = document.createElement('script');
        dbScript.src = 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js';
        dbScript.onload = () => {
        (window as any).firebaseApp = (window as any).firebase.initializeApp(FIREBASE_CONFIG);
        (window as any).database = (window as any).firebase.database();
      };
        document.head.appendChild(dbScript);
      };
      document.head.appendChild(script);
    }
  }

  // 👤 User Management
  static async saveUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<string> {
    const user: User = {
      ...userData,
      id: userData.mssv, // Dùng MSSV làm ID
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await window.database.ref(`users/${user.id}`).set(user);
    return user.id;
  }

  static async getUser(userId: string): Promise<User | null> {
    const snapshot = await window.database.ref(`users/${userId}`).once('value');
    return snapshot.val();
  }

  static async updateUserLastLogin(userId: string): Promise<void> {
    await window.database.ref(`users/${userId}/lastLogin`).set(new Date().toISOString());
  }

  // 📊 Calc History
  static async saveCalcHistory(data: Omit<CalcHistory, 'id' | 'date'>): Promise<void> {
    const history: CalcHistory = {
      ...data,
      id: `${Date.now()}-${Math.random()}`,
      date: new Date().toISOString()
    };

    await window.database.ref(`calcHistory/${history.userId}/${history.id}`).set(history);
  }

  static async getCalcHistory(userId: string): Promise<CalcHistory[]> {
    const snapshot = await window.database.ref(`calcHistory/${userId}`).once('value');
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  }

  // 📋 Eisenhower Tasks
  static async saveTask(task: Omit<EisenhowerTask, 'id' | 'createdAt'>): Promise<string> {
    const newTask: EisenhowerTask = {
      ...task,
      id: `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString()
    };

    await window.database.ref(`tasks/${newTask.userId}/${newTask.id}`).set(newTask);
    return newTask.id;
  }

  static async getTasks(userId: string): Promise<EisenhowerTask[]> {
    const snapshot = await window.database.ref(`tasks/${userId}`).once('value');
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  }

  static async updateTask(userId: string, taskId: string, updates: Partial<EisenhowerTask>): Promise<void> {
    await window.database.ref(`tasks/${userId}/${taskId}`).update(updates);
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    await window.database.ref(`tasks/${userId}/${taskId}`).remove();
  }

  // 📱 Social Posts
  static async savePost(post: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<string> {
    const newPost: SocialPost = {
      ...post,
      id: `${Date.now()}-${Math.random()}`,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    await window.database.ref(`posts/${newPost.id}`).set(newPost);
    return newPost.id;
  }

  static async getPosts(limit: number = 50): Promise<SocialPost[]> {
    const snapshot = await window.database.ref('posts')
      .orderByChild('createdAt')
      .limitToLast(limit)
      .once('value');
    
    const data = snapshot.val();
    const posts = data ? Object.values(data) as SocialPost[] : [];
    return posts.reverse(); // Mới nhất trước
  }

  static async likePost(postId: string, userId: string): Promise<void> {
    await window.database.ref(`posts/${postId}/likes`).transaction((currentLikes: number) => {
      return (currentLikes || 0) + 1;
    });
  }

  static async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<string> {
    const newComment: Comment = {
      ...comment,
      id: `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString()
    };

    await window.database.ref(`posts/${postId}/comments/${newComment.id}`).set(newComment);
    return newComment.id;
  }
}

// 🎯 Export để dùng dễ dàng
export const { 
  initializeApp,
  saveUser, 
  getUser, 
  updateUserLastLogin,
  saveCalcHistory, 
  getCalcHistory,
  saveTask, 
  getTasks, 
  updateTask, 
  deleteTask,
  savePost, 
  getPosts, 
  likePost, 
  addComment 
} = FirebaseService;
