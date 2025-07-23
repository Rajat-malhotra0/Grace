import React from "react";
import './FocusedPostModal.css';

function FocusedPostModal({ 
  focusedPost, 
  onClose, 
  onLike, 
  onShare, 
  formatTimeAgo 
}) {
  if (!focusedPost) return null;

  return (
    <div className="focused-post-overlay" onClick={onClose}>
      <div className="focused-post" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="focused-content">
          <div className="focused-media">
            {focusedPost.type === 'video' ? (
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
                <span className="user-role">{focusedPost.user.role}</span>
                <span className="post-time-large">{formatTimeAgo(focusedPost.timestamp)}</span>
              </div>
            </div>
            
            <div className="focused-caption">
              <p>{focusedPost.caption}</p>
            </div>
            
            <div className="focused-actions">
              <button 
                className={`action-btn like-btn ${focusedPost.isLiked ? 'liked' : ''}`}
                onClick={() => onLike(focusedPost.id)}
              >
                <span className="action-icon">❤️</span>
                <span>Like ({focusedPost.likes})</span>
              </button>
              
              <button className="action-btn comment-btn">
                <span className="action-icon">💬</span>
                <span>Comment ({focusedPost.comments})</span>
              </button>
              
              <button 
                className="action-btn share-btn"
                onClick={() => onShare(focusedPost.id)}
              >
                <span className="action-icon">🔄</span>
                <span>Share ({focusedPost.shares})</span>
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
                <button className="comment-submit">Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusedPostModal;
