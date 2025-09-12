import React, { useState, useEffect, useContext } from "react";
import "./Feed.css";
import FeedHeader from "./FeedHeader";
import PostsGrid from "./PostsGrid";
import FocusedPostModal from "./FocusedPostModal";
import UploadModal from "./UploadModal";
import LoadingSpinner from "./LoadingSpinner";
import feedService from "../../services/feedService";
import { AuthContext } from "../../Context/AuthContext";
import mockPosts from "./MockPostData";

function Feed() {
  const { user, isAuthenticated } = useContext(AuthContext);
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
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {}; // No pagination - get all posts
      const result = await feedService.getAllPosts(filters);
      console.log("API Response:", result);

      if (result.posts && result.posts.length > 0) {
        // Transform posts to ensure consistent data structure
        const transformedPosts = result.posts.map((post) => ({
          ...post,
          // Ensure consistent ID field for frontend operations
          id: post._id || post.id,
          // Ensure user name compatibility
          user: {
            ...post.user,
            name: post.user?.name || post.user?.userName,
            avatar:
              post.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.user?.userName || "User"
              )}&background=random`,
          },
          // Ensure count fields are available with defaults
          likesCount: post.likesCount || post.likes?.length || 0,
          commentsCount: post.commentsCount || post.comments?.length || 0,
          sharesCount: post.sharesCount || post.shares?.length || 0,
          // Ensure arrays exist with defaults
          likes: post.likes || [],
          comments: post.comments || [],
          shares: post.shares || [],
          // Compute isLiked based on current user
          isLiked: user
            ? (post.likes || []).some(
                (like) => (like.user?._id || like.user) === user._id
              )
            : false,
        }));
        setPosts(transformedPosts);

        // Update focused post if it exists
        if (focusedPost) {
          const updatedFocusedPost = transformedPosts.find(
            (p) =>
              p.id === focusedPost.id ||
              p._id === focusedPost._id ||
              p.id === focusedPost._id ||
              p._id === focusedPost.id
          );
          if (updatedFocusedPost) {
            setFocusedPost(updatedFocusedPost);
          }
        }
      } else {
        console.log("Using mock data as fallback");
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error("Error fetching posts from API, using mock data:", error);
      setError("Unable to connect to server. Showing demo content.");
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    console.log("handleLike called:", { postId, isAuthenticated, user });
    const currentUser = user || {
      _id: "demo-user",
      userName: "Demo User",
      role: "Volunteer",
      avatar: "/api/placeholder/40/40",
    };
    const postToUpdate = posts.find(
      (post) => post.id === postId || post._id === postId
    );
    const isLiked = postToUpdate?.likes?.some(
      (like) => (like.user?._id || like.user) === currentUser._id
    );

    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId || post._id === postId) {
          const newLikes = isLiked
            ? (post.likes || []).filter(
                (like) => (like.user?._id || like.user) !== currentUser._id
              )
            : [
                ...(post.likes || []),
                {
                  user: currentUser._id,
                  likedAt: new Date(),
                },
              ];

          return {
            ...post,
            likes: newLikes,
            likesCount: newLikes.length,
            isLiked: !isLiked,
          };
        }
        return post;
      });

      setPosts(updatedPosts);

      // Update focused post if it's the same post being liked
      if (
        focusedPost &&
        (focusedPost.id === postId || focusedPost._id === postId)
      ) {
        const updatedFocusedPost = updatedPosts.find(
          (post) => post.id === postId || post._id === postId
        );
        if (updatedFocusedPost) {
          setFocusedPost(updatedFocusedPost);
        }
      }

      // Try to sync with backend if user is authenticated
      if (isAuthenticated && user) {
        try {
          if (isLiked) {
            await feedService.unlikePost(postId, user._id);
          } else {
            await feedService.likePost(postId, user._id);
          }
          console.log("Like also saved to database");
        } catch (apiError) {
          console.warn("API save failed, but like updated locally:", apiError);
        }
      }
    } catch (error) {
      // Revert the optimistic update on error
      setPosts(
        posts.map((post) => {
          if (post.id === postId || post._id === postId) {
            return {
              ...post,
              likes: postToUpdate?.likes || [],
              isLiked: postToUpdate?.isLiked || false,
              likesCount: postToUpdate?.likesCount || 0,
            };
          }
          return post;
        })
      );

      console.error("Error liking post:", error);
    }
  };

  const handleShare = async (postId) => {
    console.log("handleShare called:", { postId, isAuthenticated, user });
    const currentUser = user || {
      _id: "demo-user",
      userName: "Demo User",
      role: "Volunteer",
      avatar: "/api/placeholder/40/40",
    };

    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId || post._id === postId) {
          const newShares = [
            ...(post.shares || []),
            { user: currentUser._id, sharedAt: new Date() },
          ];

          return {
            ...post,
            shares: newShares,
            sharesCount: newShares.length,
          };
        }
        return post;
      });

      setPosts(updatedPosts);

      // Update focused post if it's the same post being shared
      if (
        focusedPost &&
        (focusedPost.id === postId || focusedPost._id === postId)
      ) {
        const updatedFocusedPost = updatedPosts.find(
          (post) => post.id === postId || post._id === postId
        );
        if (updatedFocusedPost) {
          setFocusedPost(updatedFocusedPost);
        }
      }

      // Try to sync with backend if user is authenticated
      if (isAuthenticated && user) {
        try {
          await feedService.sharePost(postId, user._id);
          console.log("Share also saved to database");
        } catch (apiError) {
          console.warn("API save failed, but share updated locally:", apiError);
        }
      }

      alert("Post shared successfully!");
    } catch (error) {
      // Revert on error
      setPosts(
        posts.map((post) => {
          if (post.id === postId || post._id === postId) {
            return {
              ...post,
              shares: (post.shares || []).filter(
                (share) => (share.user?._id || share.user) !== currentUser._id
              ),
            };
          }
          return post;
        })
      );

      console.error("Error sharing post:", error);
      alert("Error sharing post. Please try again.");
    }
  };

  const handleComment = async (postId, commentText) => {
    console.log("handleComment called:", {
      postId,
      commentText,
      isAuthenticated,
      user,
    });

    if (!commentText.trim()) {
      alert("Please enter a comment");
      return false;
    }
    const currentUser = user || {
      _id: "demo-user",
      userName: "Demo User",
      role: "Volunteer",
      avatar: "/api/placeholder/40/40",
    };

    try {
      const newComment = {
        _id: Date.now(),
        user: {
          _id: currentUser._id,
          userName: currentUser.userName,
          name: currentUser.userName,
          avatar: currentUser.avatar,
        },
        text: commentText,
        commentedAt: new Date(),
        createdAt: new Date(),
      };
      const updatedPosts = posts.map((post) => {
        if (post.id === postId || post._id === postId) {
          const newComments = [...(post.comments || []), newComment];
          return {
            ...post,
            comments: newComments,
            commentsCount: newComments.length,
          };
        }
        return post;
      });

      setPosts(updatedPosts);

      // Update focused post if it's the same post being commented on
      if (
        focusedPost &&
        (focusedPost.id === postId || focusedPost._id === postId)
      ) {
        const updatedFocusedPost = updatedPosts.find(
          (post) => post.id === postId || post._id === postId
        );
        if (updatedFocusedPost) {
          setFocusedPost(updatedFocusedPost);
        }
      }
      if (isAuthenticated && user) {
        try {
          await feedService.addComment(postId, user._id, commentText);
          console.log("Comment also saved to database");
        } catch (apiError) {
          console.warn(
            "API save failed, but comment created locally:",
            apiError
          );
        }
      }

      return true;
    } catch (error) {
      setPosts(
        posts.map((post) => {
          if (post.id === postId || post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter(
                (c) => c.text !== commentText || c.user._id !== currentUser._id
              ),
            };
          }
          return post;
        })
      );
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
      return false;
    }
  };

  const handlePostSubmit = async () => {
    console.log("handlePostSubmit called:", {
      isAuthenticated,
      user,
      newPost: {
        hasPreview: !!newPost.preview,
        caption: newPost.caption,
      },
    });
    const currentUser = user || {
      _id: "demo-user",
      userName: "Demo User",
      role: "Volunteer",
      avatar: "/api/placeholder/40/40",
    };

    if (!newPost.preview && !newPost.caption.trim()) {
      alert("Please add content or caption to your post");
      return;
    }

    try {
      setLoading(true);
      const localPost = {
        id: Date.now(),
        _id: Date.now(),
        user: {
          _id: currentUser._id,
          userName: currentUser.userName,
          role: currentUser.role || "Volunteer",
          avatar: currentUser.avatar || "/api/placeholder/40/40",
        },
        type: newPost.type,
        content: newPost.preview || "https://via.placeholder.com/300x400",
        caption: newPost.caption,
        timestamp: new Date(),
        createdAt: new Date(),
        likes: [],
        comments: [],
        shares: [],
        isLiked: false,
        size: "medium",
      };

      setPosts([localPost, ...posts]);
      setNewPost({
        type: "photo",
        file: null,
        caption: "",
        preview: null,
      });

      setShowUploadModal(false);

      // Try API call in background (optional)
      if (isAuthenticated && user && newPost.file) {
        try {
          const postData = {
            user: user._id,
            caption: newPost.caption,
            size: "medium",
          };

          const apiResult = await feedService.uploadPost(
            newPost.file,
            postData
          );
          console.log(
            "Post uploaded to Cloudinary and saved to database:",
            apiResult
          );

          // Update the local post with real data from API
          setPosts((currentPosts) =>
            currentPosts.map((post) =>
              post.id === localPost.id
                ? {
                    ...post,
                    content: apiResult.content,
                    _id: apiResult._id,
                  }
                : post
            )
          );
        } catch (apiError) {
          console.warn(
            "API upload failed, but post created locally:",
            apiError
          );
        }
      } else if (isAuthenticated && user) {
        try {
          const postData = {
            user: user._id,
            type: newPost.type,
            content: newPost.preview || "https://via.placeholder.com/300x400",
            caption: newPost.caption,
            size: "medium",
          };

          await feedService.createPost(postData);
          console.log("Post saved to database");
        } catch (apiError) {
          console.warn("API save failed, but post created locally:", apiError);
        }
      }

      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post) => {
    console.log("handlePostClick called with post:", post);
    try {
      // Try to get the latest post data from the API for accurate values
      if (isAuthenticated && user && (post.id || post._id)) {
        try {
          console.log(
            "Attempting to fetch latest post data for ID:",
            post.id || post._id
          );
          const latestPostData = await feedService.getPostById(
            post.id || post._id
          );
          console.log("Latest post data from API:", latestPostData);
          if (latestPostData) {
            // Update the post with latest data and set user-specific fields
            const updatedPost = {
              ...latestPostData,
              isLiked: user
                ? (latestPostData.likes || []).some(
                    (like) => (like.user?._id || like.user) === user._id
                  )
                : false,
            };
            console.log("Setting focused post to updated data:", updatedPost);
            setFocusedPost(updatedPost);
            return;
          }
        } catch (apiError) {
          console.warn(
            "Failed to fetch latest post data, using local data:",
            apiError
          );
        }
      }

      // Fallback to local post data with computed isLiked
      const postWithUserData = {
        ...post,
        isLiked: user
          ? (post.likes || []).some(
              (like) => (like.user?._id || like.user) === user._id
            )
          : false,
      };
      console.log("Setting focused post to local data:", postWithUserData);
      setFocusedPost(postWithUserData);
    } catch (error) {
      console.error("Error handling post click:", error);
      setFocusedPost(post);
    }
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

  const handleCaptionChange = (e) => {
    setNewPost({ ...newPost, caption: e.target.value });
  };

  const handleCloseUploadModal = () => {
    setNewPost({ type: "photo", file: null, caption: "", preview: null });
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

      {error && (
        <div
          className="error-message"
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ffeaa7",
          }}
        >
          {error}
        </div>
      )}

      <PostsGrid
        posts={posts}
        focusedPost={focusedPost}
        onPostClick={handlePostClick}
        onLike={handleLike}
        onShare={handleShare}
        formatTimeAgo={formatTimeAgo}
      />
      <FocusedPostModal
        focusedPost={focusedPost}
        onClose={handleCloseFocus}
        onLike={handleLike}
        onShare={handleShare}
        onComment={handleComment}
        formatTimeAgo={formatTimeAgo}
      />
      <UploadModal
        show={showUploadModal}
        onClose={handleCloseUploadModal}
        newPost={newPost}
        onFileUpload={handleFileUpload}
        onCaptionChange={handleCaptionChange}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
}

export default Feed;
