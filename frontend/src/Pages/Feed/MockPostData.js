const mockPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      role: "Volunteer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=400&fit=crop",
    caption: "Today we helped build homes for families in need. Every nail hammered with love! 🏠💕",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 47,
    comments: 12,
    shares: 8,
    isLiked: false,
    size: "medium"
  },
  {
    id: 2,
    user: {
      name: "ArtisticSoul",
      role: "Creator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop",
    caption: "Teaching art therapy to children at the community center ✨�",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 89,
    comments: 23,
    shares: 15,
    isLiked: true,
    size: "large"
  },
  {
    id: 3,
    user: {
      name: "CraftLover",
      role: "DIY Enthusiast",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=350&fit=crop",
    caption: "Reading stories to kids at the local library. Books open minds! ☀️📚",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 34,
    comments: 8,
    shares: 5,
    isLiked: false,
    size: "medium"
  },
  {
    id: 4,
    user: {
      name: "KeychainCollector",
      role: "Collector",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&h=300&fit=crop",
    caption: "Handmade keychains sold to raise funds for animal shelter 🐾",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 156,
    comments: 34,
    shares: 28,
    isLiked: true,
    size: "small"
  },
  {
    id: 5,
    user: {
      name: "BookwormReads",
      role: "Book Lover",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=600&fit=crop",
    caption: "Book drive for underprivileged children. Knowledge is the greatest gift we can share 📖💕",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 203,
    comments: 45,
    shares: 32,
    isLiked: false,
    size: "large"
  },
  {
    id: 6,
    user: {
      name: "SoftJadeAesthetic",
      role: "Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=280&fit=crop",
    caption: "Peaceful environment at our meditation sessions for seniors 🤍",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
    likes: 78,
    comments: 12,
    shares: 18,
    isLiked: true,
    size: "small"
  },
  {
    id: 7,
    user: {
      name: "CraftMaster",
      role: "DIY Creator",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=380&fit=crop",
    caption: "Handmade birthday cards for nursing home residents 🎨❤️",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
    likes: 124,
    comments: 28,
    shares: 19,
    isLiked: true,
    size: "medium"
  },
  {
    id: 8,
    user: {
      name: "DarkAesthetic",
      role: "Visual Artist",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=350&fit=crop",
    caption: "Art therapy workshop helping people express their emotions 🎭",
    timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
    likes: 89,
    comments: 16,
    shares: 12,
    isLiked: true,
    size: "medium"
  },
  {
    id: 9,
    user: {
      name: "BookAddict",
      role: "Reader",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=520&fit=crop",
    caption: "Setting up the mobile library for remote villages. Books for everyone! 📚�",
    timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000),
    likes: 156,
    comments: 42,
    shares: 29,
    isLiked: true,
    size: "large"
  },
  {
    id: 10,
    user: {
      name: "PoetryLover",
      role: "Writer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=380&fit=crop",
    caption: "Sunrise yoga session for mental health awareness. Finding peace together 🌅🧘‍♀️",
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
    likes: 198,
    comments: 55,
    shares: 47,
    isLiked: false,
    size: "medium"
  },
  {
    id: 11,
    user: {
      name: "LifestyleBlogger",
      role: "Influencer",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop&crop=face"
    },
    type: "photo",
    content: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop",
    caption: "Care packages prepared for homeless community - small acts, big impact ✉️❤️",
    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000),
    likes: 87,
    comments: 19,
    shares: 14,
    isLiked: true,
    size: "small"
  }
];

export default mockPosts;
