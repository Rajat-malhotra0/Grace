import React, { useState, useEffect } from "react";
import "./Feed.css";
import FeedHeader from "./FeedHeader";
import PostsGrid from "./PostsGrid";
import FocusedPostModal from "./FocusedPostModal";
import UploadModal from "./UploadModal";
import LoadingSpinner from "./LoadingSpinner";
import mockPosts from "./MockPostData";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [focusedPost, setFocusedPost] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPost, setNewPost] = useState({
    type: 'photo', 
    file: null,
    caption: '',
    preview: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      setPosts(mockPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleShare = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (navigator.share) {
      navigator.share({
        title: `${post.user.name} - Grace Feed`,
        text: post.caption,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Check out this post from ${post.user.name}: ${post.caption}`);
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
          type: file.type.startsWith('video') ? 'video' : 'photo'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e) => {
    setNewPost({ ...newPost, caption: e.target.value });
  };

  const handleSubmitPost = () => {
    if (newPost.file && newPost.caption) {
      const post = {
        id: posts.length + 1,
        user: {
          name: "You",
          role: "Volunteer",
          avatar: "/api/placeholder/40/40"
        },
        type: newPost.type,
        content: newPost.preview,
        caption: newPost.caption,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false
      };
      
      setPosts([post, ...posts]);
      setNewPost({ type: 'photo', file: null, caption: '', preview: null });
      setShowUploadModal(false);
    }
  };

  const handleCloseUploadModal = () => {
    setNewPost({ type: 'photo', file: null, caption: '', preview: null });
    setShowUploadModal(false);
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
    return <LoadingSpinner />;
  }

  return (
    <div className="graceful-feed">
      <FeedHeader onShareClick={() => setShowUploadModal(true)} />
      
      <PostsGrid 
        posts={posts}
        focusedPost={focusedPost}
        onPostClick={handlePostClick}
        formatTimeAgo={formatTimeAgo}
      />
      
      <FocusedPostModal
        focusedPost={focusedPost}
        onClose={handleCloseFocus}
        onLike={handleLike}
        onShare={handleShare}
        formatTimeAgo={formatTimeAgo}
      />
      
      <UploadModal
        show={showUploadModal}
        onClose={handleCloseUploadModal}
        newPost={newPost}
        onFileUpload={handleFileUpload}
        onCaptionChange={handleCaptionChange}
        onSubmit={handleSubmitPost}
      />
    </div>
  );
}

export default Feed;
