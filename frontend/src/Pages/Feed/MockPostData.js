const mockPosts = [
    {
        id: 1,
        user: {
            name: "Sarah Johnson",
            role: "Volunteer",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        },
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=400&fit=crop",
        caption:
            "Today we helped build homes for families in need. Every nail hammered with love! ",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: [],
        comments: [],
        shares: [],
        isLiked: false,
        size: "medium",
    },
    {
        id: 2,
        user: {
            name: "ArtisticSoul",
            role: "Creator",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        },
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop",
        caption: "Teaching art therapy to children at the community center ",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: [],
        comments: [],
        shares: [],
        isLiked: true,
        size: "large",
    },
    {
        id: 3,
        user: {
            name: "CraftLover",
            role: "DIY Enthusiast",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        },
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=350&fit=crop",
        caption:
            "Reading stories to kids at the local library. Books open minds! ",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: [],
        comments: [],
        shares: [],
        isLiked: false,
        size: "medium",
    },
];

export default mockPosts;
