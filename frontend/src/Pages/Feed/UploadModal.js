import React from "react";
import './UploadModal.css';

function UploadModal({ 
  show, 
  onClose, 
  newPost, 
  onFileUpload, 
  onCaptionChange, 
  onSubmit 
}) {
  if (!show) return null;

  console.log('UploadModal rendered:', { 
    show, 
    hasPreview: !!newPost.preview, 
    caption: newPost.caption,
    hasOnSubmit: !!onSubmit 
  });

  return (
    <div className="upload-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upload-header">
          <h3>Share a Moment</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="upload-content">
          {!newPost.preview ? (
            <div className="upload-area">
              <div className="upload-icon">📷</div>
              <h4>Upload Photo or Video</h4>
              <p>Share your volunteer experiences and moments of grace</p>
              
              <input
                type="file"
                accept="image/*,video/*"
                onChange={onFileUpload}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-btn">
                Choose File
              </label>
            </div>
          ) : (
            <div className="upload-preview">
              {newPost.type === 'video' ? (
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
              
              <div className="caption-area">
                <textarea
                  placeholder="Write a caption for your post..."
                  value={newPost.caption}
                  onChange={onCaptionChange}
                  className="caption-input"
                  rows="4"
                />
                
                <div className="upload-actions">
                  <button 
                    className="cancel-btn"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button 
                    className="post-btn"
                    onClick={onSubmit}
                    disabled={!newPost.preview}
                  >
                    Share Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
