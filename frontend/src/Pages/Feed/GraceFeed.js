import React, { useState, useEffect } from "react";
import "./GraceFeed.css";

function GraceFeed() {
    const [posts, setPosts] = useState([]);
    const [focusedPost, setFocusedPost] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newPost, setNewPost] = useState({
        type: "photo",
        file: null,
        caption: "",
        preview: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const mockPosts = [
                {
                    id: 1,
                    user: {
                        name: "Sarah Johnson",
                        role: "Volunteer",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/400",
                    caption:
                        "With you, intimacy colours my voice. Even 'hello' sounds like 'come here.' ",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    likes: 47,
                    comments: 12,
                    shares: 8,
                    isLiked: false,
                    size: "medium",
                },
                {
                    id: 2,
                    user: {
                        name: "ArtisticSoul",
                        role: "Creator",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/500",
                    caption: "Anime vibes and dreamy aesthetics ",
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    likes: 89,
                    comments: 23,
                    shares: 15,
                    isLiked: true,
                    size: "large",
                },
                {
                    id: 3,
                    user: {
                        name: "CraftLover",
                        role: "DIY Enthusiast",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/350",
                    caption: "Good Morning Joy and appreciation for life! ",
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                    likes: 34,
                    comments: 8,
                    shares: 5,
                    isLiked: false,
                    size: "medium",
                },
                {
                    id: 4,
                    user: {
                        name: "KeychainCollector",
                        role: "Collector",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/300",
                    caption: "Matching batman clay keychains ",
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    likes: 156,
                    comments: 34,
                    shares: 28,
                    isLiked: true,
                    size: "small",
                },
                {
                    id: 5,
                    user: {
                        name: "BookwormReads",
                        role: "Book Lover",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/600",
                    caption:
                        "She cradles my face in her hands like I am the most precious thing in existence. I have never known a love so pure as the love she bestows upon me. ",
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    likes: 203,
                    comments: 45,
                    shares: 32,
                    isLiked: false,
                    size: "large",
                },
                {
                    id: 6,
                    user: {
                        name: "SoftJadeAesthetic",
                        role: "Designer",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/280",
                    caption: "SOFT JADE AESTHETICS Cloud White minimalism ",
                    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
                    likes: 78,
                    comments: 12,
                    shares: 18,
                    isLiked: true,
                    size: "small",
                },
                {
                    id: 7,
                    user: {
                        name: "CraftMaster",
                        role: "DIY Creator",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/380",
                    caption:
                        "Creative DIY Birthday Cards & handmade treasures ",
                    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
                    likes: 124,
                    comments: 28,
                    shares: 19,
                    isLiked: true,
                    size: "medium",
                },
                {
                    id: 8,
                    user: {
                        name: "DarkAesthetic",
                        role: "Visual Artist",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/350",
                    caption: "Moody dark vibes and artistic expressions �",
                    timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
                    likes: 89,
                    comments: 16,
                    shares: 12,
                    isLiked: true,
                    size: "medium",
                },
                {
                    id: 9,
                    user: {
                        name: "BookAddict",
                        role: "Reader",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/520",
                    caption:
                        "Book 1: How to Train Your Dragon, Book 2: How to Be a Pirate, Book 3: How to Speak Dragonese... The complete collection! ",
                    timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000),
                    likes: 156,
                    comments: 42,
                    shares: 29,
                    isLiked: true,
                    size: "large",
                },
                {
                    id: 10,
                    user: {
                        name: "PoetryLover",
                        role: "Writer",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/380",
                    caption:
                        "I shall think of you at sunset, and at sunrise, again and at noon, and forenoon, and afternoon, and always, and evermore, till this heart stops beating and is still. ",
                    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
                    likes: 198,
                    comments: 55,
                    shares: 47,
                    isLiked: false,
                    size: "medium",
                },
                {
                    id: 11,
                    user: {
                        name: "LifestyleBlogger",
                        role: "Influencer",
                        avatar: "/api/placeholder/40/40",
                    },
                    type: "photo",
                    content: "/api/placeholder/300/300",
                    caption:
                        "Letters to Susan Gilbert May 1850 - vintage aesthetic vibes ",
                    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000),
                    likes: 87,
                    comments: 19,
                    shares: 14,
                    isLiked: true,
                    size: "small",
                },
            ];
            setPosts(mockPosts);
        } catch (error) {
            // Error fetching posts
        }
        setLoading(false);
    };

    const handleLike = (postId) => {
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    };
                }
                return post;
            })
        );
    };

    const handleShare = (postId) => {
        const post = posts.find((p) => p.id === postId);
        if (navigator.share) {
            navigator.share({
                title: `${post.user.name} - Grace Feed`,
                text: post.caption,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(
                `Check out this post from ${post.user.name}: ${post.caption}`
            );
            alert("Post link copied to clipboard!");
        }
    };

    const handlePostClick = (post) => {
        setFocusedPost(post);
    };

    const handleCloseFocus = () => {
        setFocusedPost(null);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewPost({
                    ...newPost,
                    file,
                    preview: event.target.result,
                    type: file.type.startsWith("video") ? "video" : "photo",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitPost = () => {
        if (newPost.file && newPost.caption) {
            const post = {
                id: posts.length + 1,
                user: {
                    name: "You",
                    role: "Volunteer",
                    avatar: "/api/placeholder/40/40",
                },
                type: newPost.type,
                content: newPost.preview,
                caption: newPost.caption,
                timestamp: new Date(),
                likes: 0,
                comments: 0,
                shares: 0,
                isLiked: false,
            };

            setPosts([post, ...posts]);
            setNewPost({
                type: "photo",
                file: null,
                caption: "",
                preview: null,
            });
            setShowUploadModal(false);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    if (loading) {
        return (
            <div className="feed-loading">
                <div className="loading-spinner"></div>
                <p>Loading your graceful feed...</p>
            </div>
        );
    }

    return (
        <div className="graceful-feed">
            <div className="feed-header">
                <h1>Grace Feed</h1>
                <p>Share your moments of grace and impact</p>

                <button
                    className="share-moment-btn"
                    onClick={() => setShowUploadModal(true)}
                >
                    Share a Moment
                </button>
            </div>
            <div className={`posts-grid ${focusedPost ? "blurred" : ""}`}>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={`post-card ${post.type} ${
                            post.size || "medium"
                        }`}
                        onClick={() => handlePostClick(post)}
                    >
                        <div className="post-media">
                            {post.type === "video" ? (
                                <video
                                    src={post.content}
                                    poster={post.poster}
                                    className="post-video"
                                    muted
                                    loop
                                />
                            ) : (
                                <img
                                    src={post.content}
                                    alt="Post content"
                                    className="post-image"
                                />
                            )}
                            {post.type === "video" && (
                                <div className="video-play-icon">
                                    <svg
                                        width="60"
                                        height="60"
                                        viewBox="0 0 60 60"
                                    >
                                        <circle
                                            cx="30"
                                            cy="30"
                                            r="25"
                                            fill="rgba(255,255,255,0.9)"
                                        />
                                        <polygon
                                            points="24,18 24,42 42,30"
                                            fill="#222"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="post-overlay">
                            <div className="post-user">
                                <img
                                    src={post.user.avatar}
                                    alt={post.user.name}
                                    className="user-avatar"
                                />
                                <div className="user-info">
                                    <h4>{post.user.name}</h4>
                                    <span className="user-role">
                                        {post.user.role}
                                    </span>
                                </div>
                            </div>

                            <p className="post-caption">{post.caption}</p>
                            <span className="post-time">
                                {formatTimeAgo(post.timestamp)}
                            </span>
                        </div>
                        <div className="post-stats">
                            <span className="stat">❤️ {post.likes}</span>
                            <span className="stat">💬 {post.comments}</span>
                            <span className="stat">🔄 {post.shares}</span>
                        </div>
                    </div>
                ))}
            </div>
            {focusedPost && (
                <div
                    className="focused-post-overlay"
                    onClick={handleCloseFocus}
                >
                    <div
                        className="focused-post"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-btn"
                            onClick={handleCloseFocus}
                        ></button>
                        <div className="focused-content">
                            <div className="focused-media">
                                {focusedPost.type === "video" ? (
                                    <video
                                        src={focusedPost.content}
                                        poster={focusedPost.poster}
                                        controls
                                        autoPlay
                                        className="focused-video"
                                    />
                                ) : (
                                    <img
                                        src={focusedPost.content}
                                        alt="Post content"
                                        className="focused-image"
                                    />
                                )}
                            </div>
                            <div className="focused-details">
                                <div className="focused-user">
                                    <img
                                        src={focusedPost.user.avatar}
                                        alt={focusedPost.user.name}
                                        className="user-avatar-large"
                                    />
                                    <div className="user-info-large">
                                        <h3>{focusedPost.user.name}</h3>
                                        <span className="user-role">
                                            {focusedPost.user.role}
                                        </span>
                                        <span className="post-time-large">
                                            {formatTimeAgo(
                                                focusedPost.timestamp
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="focused-caption">
                                    <p>{focusedPost.caption}</p>
                                </div>
                                <div className="focused-actions">
                                    <button
                                        className={`action-btn like-btn ${
                                            focusedPost.isLiked ? "liked" : ""
                                        }`}
                                        onClick={() =>
                                            handleLike(focusedPost.id)
                                        }
                                    >
                                        <span className="action-icon">❤️</span>
                                        <span>Like ({focusedPost.likes})</span>
                                    </button>

                                    <button className="action-btn comment-btn">
                                        <span className="action-icon">💬</span>
                                        <span>
                                            Comment ({focusedPost.comments})
                                        </span>
                                    </button>

                                    <button
                                        className="action-btn share-btn"
                                        onClick={() =>
                                            handleShare(focusedPost.id)
                                        }
                                    >
                                        <span className="action-icon">🔄</span>
                                        <span>
                                            Share ({focusedPost.shares})
                                        </span>
                                    </button>
                                </div>
                                <div className="comments-section">
                                    <h4>Comments</h4>
                                    <div className="comment-input">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            className="comment-input-field"
                                        />
                                        <button className="comment-submit">
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showUploadModal && (
                <div
                    className="upload-overlay"
                    onClick={() => setShowUploadModal(false)}
                >
                    <div
                        className="upload-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="upload-header">
                            <h3>Share a Moment</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowUploadModal(false)}
                            ></button>
                        </div>
                        <div className="upload-content">
                            {!newPost.preview ? (
                                <div className="upload-area">
                                    <div className="upload-icon"></div>
                                    <h4>Upload Photo or Video</h4>
                                    <p>
                                        Share your volunteer experiences and
                                        moments of grace
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileUpload}
                                        className="file-input"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="upload-btn"
                                    >
                                        Choose File
                                    </label>
                                </div>
                            ) : (
                                <div className="upload-preview">
                                    {newPost.type === "video" ? (
                                        <video
                                            src={newPost.preview}
                                            controls
                                            className="preview-video"
                                        />
                                    ) : (
                                        <img
                                            src={newPost.preview}
                                            alt="Preview"
                                            className="preview-image"
                                        />
                                    )}
                                </div>
                            )}

                            {newPost.preview && (
                                <div className="caption-area">
                                    <textarea
                                        placeholder="Write a caption for your post..."
                                        value={newPost.caption}
                                        onChange={(e) =>
                                            setNewPost({
                                                ...newPost,
                                                caption: e.target.value,
                                            })
                                        }
                                        className="caption-input"
                                        rows="4"
                                    />

                                    <div className="upload-actions">
                                        <button
                                            className="cancel-btn"
                                            onClick={() => {
                                                setNewPost({
                                                    type: "photo",
                                                    file: null,
                                                    caption: "",
                                                    preview: null,
                                                });
                                                setShowUploadModal(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="post-btn"
                                            onClick={handleSubmitPost}
                                            disabled={!newPost.caption.trim()}
                                        >
                                            Share Post
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GraceFeed;
