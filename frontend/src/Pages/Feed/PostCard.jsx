import React from "react";
import "./PostCard.css";

// Function to dynamically import all images
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    const imageName = item.replace("./", "");
    images[imageName] = r(item);
    return null;
  });
  return images;
}

// Dynamically import all images from assets folder
const imageMap = importAll(
  require.context("../../assets", false, /\.(png|jpe?g|svg)$/)
);

function PostCard({ post, onPostClick, onLike, onShare, formatTimeAgo }) {
  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(post.id || post._id);
  };
  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare(post.id || post._id);
  };
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const commentsCount = post.commentsCount ?? post.comments?.length ?? 0;
  const sharesCount = post.sharesCount ?? post.shares?.length ?? 0;
  const isLiked = post.isLiked || false;

  // Get the correct image source
  const getImageSource = (content) => {
    // If it's already a full URL or path, use it directly
    if (
      content &&
      (content.startsWith("http") ||
        content.startsWith("/") ||
        content.startsWith("data:"))
    ) {
      return content;
    }
    // If it's just a filename, try to get it from our imported images
    return imageMap[content] || content;
  };

  return (
    <div
      className={`post-card ${post.type} ${post.size || "medium"}`}
      onClick={() => onPostClick(post)}
    >
      <div className="post-media">
        {post.type === "video" ? (
          <video
            src={getImageSource(post.content)}
            poster={post.poster}
            className="post-video"
            muted
            loop
          />
        ) : (
          <img
            src={getImageSource(post.content)}
            alt="Post content"
            className="post-image"
          />
        )}
        {post.type === "video" && (
          <div className="video-play-icon">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill="rgba(255,255,255,0.9)" />
              <polygon points="24,18 24,42 42,30" fill="#222" />
            </svg>
          </div>
        )}
      </div>

      <div className="post-overlay">
        <div className="post-user">
          <img
            src={
              post.user?.avatar || "https://via.placeholder.com/40x40?text=U"
            }
            alt={post.user?.name || post.user?.userName || "Unknown User"}
            className="user-avatar"
          />
          <div className="user-info">
            <h4>{post.user?.name || post.user?.userName || "Unknown User"}</h4>
            <span className="user-role">{post.user?.role || "Member"}</span>
          </div>
        </div>

        <p className="post-caption">{post.caption}</p>
        <span className="post-time">
          {formatTimeAgo(post.timestamp || new Date(post.createdAt))}
        </span>
      </div>

      <div className="post-stats">
        <span
          className={`stat ${isLiked ? "liked" : ""}`}
          onClick={handleLikeClick}
          style={{ cursor: "pointer" }}
        >
          {isLiked ? "❤️" : "♡"} {likesCount}
        </span>
        <span className="stat">💬 {commentsCount}</span>
        <span
          className="stat"
          onClick={handleShareClick}
          style={{ cursor: "pointer" }}
        >
          🔄 {sharesCount}
        </span>
      </div>
    </div>
  );
}

export default PostCard;
