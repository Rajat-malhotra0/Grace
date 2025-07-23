import React from "react";
import "./PostCard.css";

function PostCard({ post, onPostClick, formatTimeAgo }) {
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
            src={post.user.avatar} 
            alt={post.user.name} 
            className="user-avatar"
          />
          <div className="user-info">
            <h4>{post.user.name}</h4>
            <span className="user-role">{post.user.role}</span>
          </div>
        </div>
        
        <p className="post-caption">{post.caption}</p>
        <span className="post-time">{formatTimeAgo(post.timestamp)}</span>
      </div>
      
      <div className="post-stats">
        <span className="stat">❤️ {post.likes}</span>
        <span className="stat">💬 {post.comments}</span>
        <span className="stat">🔄 {post.shares}</span>
      </div>
    </div>
  );
}

export default PostCard;
