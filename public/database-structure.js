// 🗄️ Firebase Realtime Database Structure cho FPTU Survival Kit
// Design cho cộng đồng với đầy đủ tính năng

window.DATABASE_STRUCTURE = {
  // 👥 Users Management
  users: {
    "{userId}": {
      profile: {
        name: "string",
        email: "string", 
        avatar: "string",
        mssv: "string",
        campus: "string", // HN, HCM, DN, CT, QN
        major: "string",
        year: "number",
        bio: "string",
        joinedAt: "timestamp",
        lastActive: "timestamp",
        isOnline: "boolean",
        reputation: "number"
      },
      stats: {
        postsCount: "number",
        commentsCount: "number", 
        likesGiven: "number",
        likesReceived: "number",
        helpfulVotes: "number"
      },
      settings: {
        notifications: "boolean",
        emailAlerts: "boolean",
        privacy: "string" // public, friends, private
      }
    }
  },

  // 📝 Community Posts
  community: {
    posts: {
      "{postId}": {
        author: {
          uid: "string",
          name: "string",
          avatar: "string",
          mssv: "string"
        },
        content: {
          title: "string",
          body: "string",
          category: "string", // question, experience, tip, warning, event
          tags: ["string"],
          images: ["string"],
          links: ["string"]
        },
        metadata: {
          createdAt: "timestamp",
          updatedAt: "timestamp",
          views: "number",
          likes: "number",
          comments: "number",
          shares: "number",
          status: "string" // active, hidden, deleted
        },
        engagement: {
          likedBy: ["{userId}"],
          savedBy: ["{userId}"],
          reportedBy: ["{userId}"]
        }
      }
    },
    categories: {
      "{categoryName}": {
        name: "string",
        description: "string",
        icon: "string",
        color: "string",
        postCount: "number",
        isActive: "boolean"
      }
    }
  },

  // 💬 Comments System
  comments: {
    "{postId}": {
      "{commentId}": {
        author: {
          uid: "string",
          name: "string", 
          avatar: "string",
          mssv: "string"
        },
        content: {
          body: "string",
          mentions: ["{userId}"],
          attachments: ["string"]
        },
        metadata: {
          createdAt: "timestamp",
          updatedAt: "timestamp",
          likes: "number",
          replies: "number",
          isAnswer: "boolean"
        },
        engagement: {
          likedBy: ["{userId}"],
          reportedBy: ["{userId}"]
        }
      }
    }
  },

  // 🔥 Hot/Trending Content
  trending: {
    daily: {
      "{date}": {
        posts: ["{postId}"],
        users: ["{userId}"],
        tags: ["string"]
      }
    },
    weekly: {
      "{week}": {
        posts: ["{postId}"],
        users: ["{userId}"],
        tags: ["string"]
      }
    }
  },

  // 📚 Knowledge Base
  knowledge: {
    subjects: {
      "{subjectCode}": {
        name: "string",
        englishName: "string",
        description: "string",
        category: "string",
        difficulty: "string", // easy, medium, hard
        credits: "number",
        resources: {
          documents: ["string"],
          videos: ["string"],
          tips: ["string"]
        },
        stats: {
          views: "number",
          helpfulVotes: "number",
          discussions: "number"
        }
      }
    },
    tips: {
      "{tipId}": {
        title: "string",
        content: "string",
        category: "string",
        author: "string",
        tags: ["string"],
        upvotes: "number",
        downvotes: "number",
        createdAt: "timestamp"
      }
    }
  },

  // 🎯 Events & Activities
  events: {
    "{eventId}": {
      title: "string",
      description: "string",
      type: "string", // workshop, contest, seminar, party
      organizer: {
        name: "string",
        club: "string",
        contact: "string"
      },
      schedule: {
        startDate: "timestamp",
        endDate: "timestamp",
        location: "string",
        isOnline: "boolean"
      },
      participation: {
        attendees: ["{userId}"],
        maxAttendees: "number",
        waitlist: ["{userId}"],
        requirements: ["string"]
      },
      metadata: {
        createdAt: "timestamp",
        updatedAt: "timestamp",
        status: "string", // upcoming, ongoing, completed, cancelled
        views: "number",
        shares: "number"
      }
    }
  },

  // 🏆 Gamification & Rewards
  gamification: {
    achievements: {
      "{userId}": {
        badges: ["string"],
        points: "number",
        level: "number",
        streaks: {
          daily: "number",
          weekly: "number"
        },
        milestones: {
          firstPost: "timestamp",
          firstComment: "timestamp",
          firstLike: "timestamp",
          helpfulMember: "timestamp"
        }
      }
    },
    leaderboard: {
      weekly: {
        "{userId}": {
          rank: "number",
          points: "number",
          change: "number"
        }
      },
      allTime: {
        "{userId}": {
          rank: "number", 
          points: "number",
          change: "number"
        }
      }
    }
  },

  // 📊 Analytics & Reports
  analytics: {
    daily: {
      "{date}": {
        activeUsers: "number",
        newPosts: "number",
        newComments: "number",
        totalViews: "number",
        topTags: ["string"],
        topCategories: ["string"]
      }
    },
    reports: {
      "{reportId}": {
        type: "string", // spam, inappropriate, abuse
        reporter: "string",
        target: "string", // postId, commentId, userId
        reason: "string",
        status: "string", // pending, reviewed, resolved
        createdAt: "timestamp",
        resolvedAt: "timestamp",
        resolvedBy: "string"
      }
    }
  }
};

console.log('🗄️ Database structure loaded for FPTU Survival Kit Community');
