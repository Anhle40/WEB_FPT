// 🎨 FPTU Survival Kit - Community UI Components
// Modern, responsive UI for community features

window.CommunityUI = {
  // 📝 Create Post Modal
  showCreatePostModal: function() {
    const modal = `
      <div id="create-post-modal" class="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h3 class="text-xl font-bold text-slate-800">📝 Đăng bài mới</h3>
            <button onclick="CommunityUI.closeCreatePostModal()" class="text-slate-400 hover:text-slate-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form id="create-post-form" class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tiêu đề</label>
              <input type="text" id="post-title" required
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập tiêu đề bài viết...">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nội dung</label>
              <textarea id="post-body" required rows="6"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Chia sẻ kinh nghiệm, câu hỏi, hoặc thông tin hữu ích..."></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
                <select id="post-category" required
                  class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Chọn danh mục</option>
                  <option value="question">❓ Câu hỏi</option>
                  <option value="experience">💡 Kinh nghiệm</option>
                  <option value="tip">📝 Mẹo vặt</option>
                  <option value="warning">⚠️ Cảnh báo</option>
                  <option value="event">🎉 Sự kiện</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tags (cách nhau bởi dấu phẩy)</label>
                <input type="text" id="post-tags"
                  class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="VD: MAD101, PRF192, study-tips">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Links (tùy chọn)</label>
              <input type="text" id="post-links"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="VD: https://example.com, https://resource.com">
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" 
                class="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                📤 Đăng bài
              </button>
              <button type="button" onclick="CommunityUI.closeCreatePostModal()"
                class="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Setup form submission
    document.getElementById('create-post-form').addEventListener('submit', CommunityUI.handleCreatePost);
  },
  
  closeCreatePostModal: function() {
    const modal = document.getElementById('create-post-modal');
    if (modal) {
      modal.remove();
    }
  },
  
  handleCreatePost: async function(e) {
    e.preventDefault();
    
    try {
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Đang đăng...';
      
      const postData = {
        title: document.getElementById('post-title').value,
        body: document.getElementById('post-body').value,
        category: document.getElementById('post-category').value,
        tags: document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        links: document.getElementById('post-links').value.split(',').map(link => link.trim()).filter(link => link)
      };
      
      const postId = await Community.createPost(postData);
      
      // Show success message
      window.showNotification('✅ Bài viết đã được đăng thành công!', 'success');
      
      // Close modal and refresh posts
      CommunityUI.closeCreatePostModal();
      await Community.loadPosts();
      
      if (window.updatePostsUI) {
        window.updatePostsUI();
      }
      
    } catch (error) {
      console.error('❌ Failed to create post:', error);
      window.showNotification('❌ ' + error.message, 'error');
    } finally {
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '📤 Đăng bài';
    }
  },
  
  // 📋 Posts List
  renderPosts: function(posts, containerId = 'community-posts') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (posts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-comments text-6xl text-slate-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-slate-600 mb-2">Chưa có bài viết nào</h3>
          <p class="text-slate-500 mb-6">Hãy là người đầu tiên chia sẻ kiến thức!</p>
          <button onclick="CommunityUI.showCreatePostModal()" 
            class="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
            ✍️ Đăng bài ngay
          </button>
        </div>
      `;
      return;
    }
    
    const postsHTML = posts.map(post => CommunityUI.renderPostCard(post)).join('');
    container.innerHTML = postsHTML;
  },
  
  renderPostCard: function(post) {
    const timeAgo = CommunityUI.getTimeAgo(post.metadata.createdAt);
    const isLiked = Community.currentUser && post.engagement.likedBy.includes(Community.currentUser.mssv);
    
    return `
      <div class="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
        <!-- Author Info -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <img src="${post.author.avatar}" alt="${post.author.name}" 
              class="w-10 h-10 rounded-full object-cover">
            <div>
              <h4 class="font-semibold text-slate-800">${post.author.name}</h4>
              <p class="text-sm text-slate-500">${post.author.mssv} • ${timeAgo}</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            ${CommunityUI.getCategoryLabel(post.content.category)}
          </span>
        </div>
        
        <!-- Post Content -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-slate-800 mb-2">${post.content.title}</h3>
          <p class="text-slate-600 line-clamp-3">${post.content.body}</p>
        </div>
        
        <!-- Tags -->
        ${post.content.tags.length > 0 ? `
          <div class="flex flex-wrap gap-2 mb-4">
            ${post.content.tags.map(tag => `
              <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">#${tag}</span>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div class="flex items-center gap-4">
            <button onclick="CommunityUI.likePost('${post.id}')" 
              class="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors">
              <i class="fas fa-heart${isLiked ? '' : '-o'}"></i>
              <span class="text-sm">${post.metadata.likes}</span>
            </button>
            <button onclick="CommunityUI.showComments('${post.id}')"
              class="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors">
              <i class="fas fa-comment"></i>
              <span class="text-sm">${post.metadata.comments}</span>
            </button>
            <button class="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors">
              <i class="fas fa-share"></i>
              <span class="text-sm">${post.metadata.shares}</span>
            </button>
          </div>
          <button class="text-slate-400 hover:text-slate-600">
            <i class="fas fa-bookmark"></i>
          </button>
        </div>
      </div>
    `;
  },
  
  // 💬 Comments Section
  showComments: async function(postId) {
    try {
      const comments = await Community.loadComments(postId);
      const post = Community.posts.find(p => p.id === postId);
      
      const modal = `
        <div id="comments-modal" class="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-slate-800">💬 Bình luận</h3>
                <button onclick="CommunityUI.closeCommentsModal()" class="text-slate-400 hover:text-slate-600">
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
              <p class="text-slate-600 mt-2">${post.content.title}</p>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6">
              <div class="space-y-4 mb-6" id="comments-list">
                ${comments.map(comment => CommunityUI.renderComment(comment)).join('')}
              </div>
              
              <!-- Add Comment Form -->
              <form id="add-comment-form" class="space-y-4">
                <textarea id="comment-body" required rows="3"
                  class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Viết bình luận của bạn..."></textarea>
                <button type="submit" 
                  class="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                  💬 Gửi bình luận
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modal);
      
      // Setup form submission
      document.getElementById('add-comment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        CommunityUI.handleAddComment(postId);
      });
      
    } catch (error) {
      console.error('❌ Failed to load comments:', error);
      window.showNotification('❌ Không thể tải bình luận', 'error');
    }
  },
  
  closeCommentsModal: function() {
    const modal = document.getElementById('comments-modal');
    if (modal) {
      modal.remove();
    }
  },
  
  handleAddComment: async function(postId) {
    try {
      const commentBody = document.getElementById('comment-body').value;
      const submitBtn = document.querySelector('#add-comment-form button[type="submit"]');
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Đang gửi...';
      
      await Community.addComment(postId, commentBody);
      
      // Refresh comments
      const comments = await Community.loadComments(postId);
      const commentsList = document.getElementById('comments-list');
      commentsList.innerHTML = comments.map(comment => CommunityUI.renderComment(comment)).join('');
      
      // Clear form
      document.getElementById('comment-body').value = '';
      
      window.showNotification('✅ Bình luận đã được gửi!', 'success');
      
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
      window.showNotification('❌ ' + error.message, 'error');
    } finally {
      const submitBtn = document.querySelector('#add-comment-form button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '💬 Gửi bình luận';
    }
  },
  
  renderComment: function(comment) {
    const timeAgo = CommunityUI.getTimeAgo(comment.metadata.createdAt);
    
    return `
      <div class="flex gap-3">
        <img src="${comment.author.avatar}" alt="${comment.author.name}" 
          class="w-8 h-8 rounded-full object-cover flex-shrink-0">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-slate-800">${comment.author.name}</span>
            <span class="text-xs text-slate-500">${timeAgo}</span>
          </div>
          <p class="text-slate-600">${comment.content.body}</p>
          <div class="flex items-center gap-4 mt-2">
            <button class="text-xs text-slate-500 hover:text-orange-500">
              <i class="fas fa-heart"></i> ${comment.metadata.likes}
            </button>
            <button class="text-xs text-slate-500 hover:text-blue-500">
              <i class="fas fa-reply"></i> Trả lời
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  // 🔥 Trending Section
  renderTrending: function(trending, containerId = 'trending-content') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const trendingHTML = `
      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-slate-800 mb-3">🔥 Bài viết nổi bật</h4>
          <div class="space-y-2">
            ${trending.posts.slice(0, 5).map(postId => {
              const post = Community.posts.find(p => p.id === postId);
              return post ? `
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                  <span class="text-orange-500 font-bold">🔥</span>
                  <div class="flex-1">
                    <p class="font-medium text-slate-800 line-clamp-1">${post.content.title}</p>
                    <p class="text-xs text-slate-500">${post.author.name} • ${post.metadata.likes} likes</p>
                  </div>
                </div>
              ` : '';
            }).join('')}
          </div>
        </div>
        
        <div>
          <h4 class="font-semibold text-slate-800 mb-3">🏷️ Tags nổi bật</h4>
          <div class="flex flex-wrap gap-2">
            ${trending.tags.map(tag => `
              <span class="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full cursor-pointer hover:bg-orange-200">
                #${tag}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = trendingHTML;
  },
  
  // 🛠️ Utility Functions
  getCategoryLabel: function(category) {
    const labels = {
      question: '❓ Câu hỏi',
      experience: '💡 Kinh nghiệm',
      tip: '📝 Mẹo vặt',
      warning: '⚠️ Cảnh báo',
      event: '🎉 Sự kiện'
    };
    return labels[category] || category;
  },
  
  getTimeAgo: function(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return past.toLocaleDateString('vi-VN');
  }
};

console.log('🎨 Community UI Components loaded');
