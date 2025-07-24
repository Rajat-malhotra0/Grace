import React from "react";
import "./PostCard.css";

function PostCard({ post, onPostClick, onLike, onShare, formatTimeAgo }) {
  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(post.id || post._id);
  };
  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare(post.id || post._id);
  };
  const likesCount = post.likes?.length || post.likes || 0;
  const commentsCount = post.comments?.length || post.comments || 0;
  const sharesCount = post.shares?.length || post.shares || 0;
  const isLiked = post.isLiked || (post.likes && Array.isArray(post.likes) && post.likes.length > 0);

  return (
    <div 
      className={`post-card ${post.type} ${post.size || 'medium'}`}
      onClick={() => onPostClick(post)}
    >
      <div className="post-media">
        {post.type === 'video' ? (
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
        {post.type === 'video' && (
          <div className="video-play-icon">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill="rgba(255,255,255,0.9)"/>
              <polygon points="24,18 24,42 42,30" fill="#222"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className="post-overlay">
        <div className="post-user">
          <img 
            src={post.user?.avatar || 'https://via.placeholder.com/40x40?text=U'} 
            alt={post.user?.name || post.user?.userName || 'Unknown User'} 
            className="user-avatar"
          />
          <div className="user-info">
            <h4>{post.user?.name || post.user?.userName || 'Unknown User'}</h4>
            <span className="user-role">{post.user?.role || 'Member'}</span>
          </div>
        </div>
        
        <p className="post-caption">{post.caption}</p>
        <span className="post-time">
          {formatTimeAgo(post.timestamp || new Date(post.createdAt))}
        </span>
      </div>
      
      <div className="post-stats">
        <span 
          className={`stat ${isLiked ? 'liked' : ''}`} 
          onClick={handleLikeClick}
          style={{ cursor: 'pointer' }}
        >
          {isLiked ? '❤️' : '♡'} {likesCount}
        </span>
        <span className="stat">💬 {commentsCount}</span>
        <span 
          className="stat" 
          onClick={handleShareClick}
          style={{ cursor: 'pointer' }}
        >
          🔄 {sharesCount}
        </span>
      </div>
    </div>
  );
}

export default PostCard;
