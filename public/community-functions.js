// 🌟 FPTU Survival Kit - Community Functions
// Full-featured community management system

// Global state
window.Community = {
  currentUser: null,
  posts: [],
  categories: [],
  trending: [],
  isLoading: false
};

// 🎯 Initialize Community System
window.initCommunity = async function() {
  try {
    console.log('🌟 Initializing FPTU Community System...');
    
    // Wait for Firebase to be ready
    if (!window.database) {
      console.error('❌ Firebase Database not ready');
      return false;
    }
    
    // Load current user
    await Community.loadCurrentUser();
    
    // Load categories
    await Community.loadCategories();
    
    // Load trending posts
    await Community.loadTrending();
    
    // Setup real-time listeners
    Community.setupRealtimeListeners();
    
    console.log('✅ Community System initialized successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to initialize Community:', error);
    return false;
  }
};

// 👤 User Management
window.Community.loadCurrentUser = async function() {
  const userSession = localStorage.getItem('fptu_user_session');
  if (userSession) {
    Community.currentUser = JSON.parse(userSession);
    
    // Update last active
    const userRef = window.database.ref(`users/${Community.currentUser.mssv}/profile/lastActive`);
    await userRef.set(new Date().toISOString());
    
    console.log('👤 Current user loaded:', Community.currentUser.name);
  }
};

// 📝 Post Management
window.Community.createPost = async function(postData) {
  try {
    if (!Community.currentUser) {
      throw new Error('Bạn cần đăng nhập để đăng bài');
    }
    
    const postId = window.database.ref('community/posts').push().key;
    const timestamp = new Date().toISOString();
    
    const newPost = {
      author: {
        uid: Community.currentUser.mssv,
        name: Community.currentUser.name,
        avatar: Community.currentUser.avatar || '/placeholder-user.jpg',
        mssv: Community.currentUser.mssv
      },
      content: {
        title: postData.title,
        body: postData.body,
        category: postData.category,
        tags: postData.tags || [],
        images: postData.images || [],
        links: postData.links || []
      },
      metadata: {
        createdAt: timestamp,
        updatedAt: timestamp,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        status: 'active'
      },
      engagement: {
        likedBy: [],
        savedBy: [],
        reportedBy: []
      }
    };
    
    // Save post
    await window.database.ref(`community/posts/${postId}`).set(newPost);
    
    // Update user stats
    const userStatsRef = window.database.ref(`users/${Community.currentUser.mssv}/stats/postsCount`);
    await userStatsRef.transaction((current) => (current || 0) + 1);
    
    // Update category count
    const categoryRef = window.database.ref(`community/categories/${postData.category}/postCount`);
    await categoryRef.transaction((current) => (current || 0) + 1);
    
    console.log('✅ Post created successfully:', postId);
    return postId;
    
  } catch (error) {
    console.error('❌ Failed to create post:', error);
    throw error;
  }
};

window.Community.loadPosts = async function(category = null, limit = 20) {
  try {
    Community.isLoading = true;
    
    let query = window.database.ref('community/posts')
      .orderByChild('metadata/createdAt')
      .limitToLast(limit);
    
    const snapshot = await query.get();
    const posts = [];
    
    snapshot.forEach(child => {
      const post = child.val();
      post.id = child.key;
      posts.reverse().push(post); // Reverse to get newest first
    });
    
    // Filter by category if specified
    if (category) {
      Community.posts = posts.filter(post => post.content.category === category);
    } else {
      Community.posts = posts;
    }
    
    Community.isLoading = false;
    console.log(`📝 Loaded ${Community.posts.length} posts`);
    return Community.posts;
    
  } catch (error) {
    console.error('❌ Failed to load posts:', error);
    Community.isLoading = false;
    return [];
  }
};

window.Community.likePost = async function(postId) {
  try {
    if (!Community.currentUser) {
      throw new Error('Bạn cần đăng nhập để thích bài viết');
    }
    
    const userId = Community.currentUser.mssv;
    const postRef = window.database.ref(`community/posts/${postId}`);
    
    // Get current post
    const snapshot = await postRef.get();
    const post = snapshot.val();
    
    // Toggle like
    const isLiked = post.engagement.likedBy.includes(userId);
    
    if (isLiked) {
      // Remove like
      await postRef.child('engagement/likedBy').set(
        post.engagement.likedBy.filter(id => id !== userId)
      );
      await postRef.child('metadata/likes').set(post.metadata.likes - 1);
    } else {
      // Add like
      await postRef.child('engagement/likedBy').set([...post.engagement.likedBy, userId]);
      await postRef.child('metadata/likes').set(post.metadata.likes + 1);
    }
    
    console.log(`${isLiked ? '❌' : '❤️'} Post ${isLiked ? 'unliked' : 'liked'}: ${postId}`);
    return !isLiked;
    
  } catch (error) {
    console.error('❌ Failed to like post:', error);
    throw error;
  }
};

// 💬 Comment Management
window.Community.addComment = async function(postId, commentBody) {
  try {
    if (!Community.currentUser) {
      throw new Error('Bạn cần đăng nhập để bình luận');
    }
    
    const commentId = window.database.ref(`comments/${postId}`).push().key;
    const timestamp = new Date().toISOString();
    
    const newComment = {
      author: {
        uid: Community.currentUser.mssv,
        name: Community.currentUser.name,
        avatar: Community.currentUser.avatar || '/placeholder-user.jpg',
        mssv: Community.currentUser.mssv
      },
      content: {
        body: commentBody,
        mentions: [],
        attachments: []
      },
      metadata: {
        createdAt: timestamp,
        updatedAt: timestamp,
        likes: 0,
        replies: 0,
        isAnswer: false
      },
      engagement: {
        likedBy: [],
        reportedBy: []
      }
    };
    
    // Save comment
    await window.database.ref(`comments/${postId}/${commentId}`).set(newComment);
    
    // Update post comment count
    const postRef = window.database.ref(`community/posts/${postId}/metadata/comments`);
    await postRef.transaction((current) => (current || 0) + 1);
    
    // Update user stats
    const userStatsRef = window.database.ref(`users/${Community.currentUser.mssv}/stats/commentsCount`);
    await userStatsRef.transaction((current) => (current || 0) + 1);
    
    console.log('💬 Comment added successfully:', commentId);
    return commentId;
    
  } catch (error) {
    console.error('❌ Failed to add comment:', error);
    throw error;
  }
};

window.Community.loadComments = async function(postId) {
  try {
    const snapshot = await window.database.ref(`comments/${postId}`).get();
    const comments = [];
    
    snapshot.forEach(child => {
      const comment = child.val();
      comment.id = child.key;
      comments.push(comment);
    });
    
    // Sort by created date
    comments.sort((a, b) => new Date(a.metadata.createdAt) - new Date(b.metadata.createdAt));
    
    console.log(`💬 Loaded ${comments.length} comments for post: ${postId}`);
    return comments;
    
  } catch (error) {
    console.error('❌ Failed to load comments:', error);
    return [];
  }
};

// 🏷️ Category Management
window.Community.loadCategories = async function() {
  try {
    const snapshot = await window.database.ref('community/categories').get();
    const categories = [];
    
    snapshot.forEach(child => {
      const category = child.val();
      category.id = child.key;
      categories.push(category);
    });
    
    Community.categories = categories;
    console.log(`🏷️ Loaded ${categories.length} categories`);
    return categories;
    
  } catch (error) {
    console.error('❌ Failed to load categories:', error);
    return [];
  }
};

// 🔥 Trending Content
window.Community.loadTrending = async function() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const snapshot = await window.database.ref(`trending/daily/${today}`).get();
    
    if (snapshot.exists()) {
      const trending = snapshot.val();
      Community.trending = trending;
      console.log('🔥 Trending content loaded:', trending);
    } else {
      // Calculate trending from recent activity
      await Community.calculateTrending();
    }
    
    return Community.trending;
    
  } catch (error) {
    console.error('❌ Failed to load trending:', error);
    return { posts: [], users: [], tags: [] };
  }
};

window.Community.calculateTrending = async function() {
  try {
    // Get posts from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const snapshot = await window.database.ref('community/posts')
      .orderByChild('metadata/createdAt')
      .startAt(yesterday)
      .get();
    
    const posts = [];
    const users = new Set();
    const tags = new Set();
    
    snapshot.forEach(child => {
      const post = child.val();
      if (post.metadata.status === 'active') {
        posts.push(child.key);
        users.add(post.author.uid);
        post.content.tags.forEach(tag => tags.add(tag));
      }
    });
    
    const trending = {
      posts: posts.slice(0, 10), // Top 10 posts
      users: Array.from(users).slice(0, 5), // Top 5 users
      tags: Array.from(tags).slice(0, 8) // Top 8 tags
    };
    
    // Save to database
    const today = new Date().toISOString().split('T')[0];
    await window.database.ref(`trending/daily/${today}`).set(trending);
    
    Community.trending = trending;
    console.log('🔥 Trending calculated and saved:', trending);
    return trending;
    
  } catch (error) {
    console.error('❌ Failed to calculate trending:', error);
    return { posts: [], users: [], tags: [] };
  }
};

// 🔄 Real-time Listeners
window.Community.setupRealtimeListeners = function() {
  // Listen for new posts
  window.database.ref('community/posts').orderByChild('metadata/createdAt')
    .on('child_added', (snapshot) => {
      const post = snapshot.val();
      post.id = snapshot.key;
      
      // Add to beginning of posts array
      Community.posts.unshift(post);
      
      // Update UI if needed
      if (window.updatePostsUI) {
        window.updatePostsUI();
      }
      
      console.log('🔄 New post detected:', post.id);
    });
  
  // Listen for post updates (likes, comments)
  window.database.ref('community/posts').on('child_changed', (snapshot) => {
    const updatedPost = snapshot.val();
    updatedPost.id = snapshot.key;
    
    // Update post in array
    const index = Community.posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      Community.posts[index] = updatedPost;
      
      // Update UI if needed
      if (window.updatePostUI) {
        window.updatePostUI(updatedPost.id);
      }
    }
    
    console.log('🔄 Post updated:', updatedPost.id);
  });
};

// 🎯 Search Functionality
window.Community.searchPosts = async function(query, filters = {}) {
  try {
    const allPosts = await Community.loadPosts();
    
    let filteredPosts = allPosts.filter(post => {
      const matchesQuery = !query || 
        post.content.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.body.toLowerCase().includes(query.toLowerCase()) ||
        post.content.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !filters.category || post.content.category === filters.category;
      const matchesAuthor = !filters.author || post.author.name.toLowerCase().includes(filters.author.toLowerCase());
      
      return matchesQuery && matchesCategory && matchesAuthor;
    });
    
    console.log(`🔍 Found ${filteredPosts.length} posts matching query: "${query}"`);
    return filteredPosts;
    
  } catch (error) {
    console.error('❌ Failed to search posts:', error);
    return [];
  }
};

// 🔄 Filter Posts Function
window.Community.filterPosts = async function(filter) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-orange-100', 'text-orange-700');
    btn.classList.add('text-slate-600', 'hover:bg-slate-100');
  });
  
  if (event && event.target) {
    event.target.classList.remove('text-slate-600', 'hover:bg-slate-100');
    event.target.classList.add('bg-orange-100', 'text-orange-700');
  }
  
  // Filter posts based on filter type
  let filteredPosts = Community.posts;
  
  if (filter === 'global') {
    // Show all posts (toàn quốc)
    filteredPosts = Community.posts;
  } else if (filter === 'all') {
    // Show community posts only (cộng đồng)
    filteredPosts = Community.posts.filter(post => {
      // Filter by current user's campus or general community posts
      const currentUser = Community.currentUser;
      if (currentUser && currentUser.campus) {
        return post.content.category === 'community' || 
               post.author.campus === currentUser.campus ||
               post.content.tags.includes('community');
      }
      return post.content.category === 'community' || post.content.tags.includes('community');
    });
  }
  
  CommunityUI.renderPosts(filteredPosts);
};

console.log('🌟 FPTU Community Functions loaded');
