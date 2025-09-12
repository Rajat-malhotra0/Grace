import React, { useState } from "react";
import "./FocusedPostModal.css";

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

function FocusedPostModal({
  focusedPost,
  onClose,
  onLike,
  onShare,
  onComment,
  formatTimeAgo,
}) {
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!focusedPost) return null;

  console.log("FocusedPostModal - Received focusedPost:", focusedPost);
  console.log("FocusedPostModal - Content field:", focusedPost.content);

  // Get the correct image source
  const getImageSource = (content) => {
    console.log("FocusedPostModal - Original content:", content);

    // If it's already a full URL or path, use it directly
    if (
      content &&
      (content.startsWith("http") ||
        content.startsWith("/") ||
        content.startsWith("data:"))
    ) {
      console.log("FocusedPostModal - Using URL directly:", content);
      return content;
    }

    // If it's just a filename, try to get it from our imported images
    let resolvedImage = imageMap[content];

    // If not found in imageMap, try to construct a direct path
    if (!resolvedImage && content) {
      // Try different common paths
      const possiblePaths = [
        `/src/assets/${content}`,
        `./assets/${content}`,
        require(`../../assets/${content}`),
      ];

      for (const path of possiblePaths) {
        try {
          resolvedImage = path;
          break;
        } catch (e) {
          // Path doesn't exist, continue
        }
      }
    }

    resolvedImage =
      resolvedImage ||
      content ||
      "https://via.placeholder.com/400x300?text=Image+Not+Found";

    console.log("FocusedPostModal - Resolved to:", resolvedImage);
    console.log("FocusedPostModal - Available images:", Object.keys(imageMap));

    return resolvedImage;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    const success = await onComment(
      focusedPost.id || focusedPost._id,
      commentText
    );
    if (success) {
      setCommentText("");
    }
    setIsSubmittingComment(false);
  };
  const handleLikeClick = () => {
    onLike(focusedPost.id || focusedPost._id);
  };
  const handleShareClick = () => {
    onShare(focusedPost.id || focusedPost._id);
  };
  const likesCount = focusedPost.likesCount ?? focusedPost.likes?.length ?? 0;
  const commentsCount =
    focusedPost.commentsCount ?? focusedPost.comments?.length ?? 0;
  const sharesCount =
    focusedPost.sharesCount ?? focusedPost.shares?.length ?? 0;
  const isLiked = focusedPost.isLiked || false;

  return (
    <div className="focused-post-overlay" onClick={onClose}>
      <div className="focused-post" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}></button>

        <div className="focused-content">
          <div className="focused-media">
            {focusedPost.type === "video" ? (
              <video
                src={getImageSource(focusedPost.content)}
                poster={focusedPost.poster}
                controls
                autoPlay
                className="focused-video"
              />
            ) : (
              <img
                src={getImageSource(focusedPost.content)}
                alt="Post content"
                className="focused-image"
                onLoad={() => {
                  console.log(
                    "Image loaded successfully:",
                    getImageSource(focusedPost.content)
                  );
                }}
                onError={(e) => {
                  console.log("Image failed to load:", focusedPost.content);
                  console.log(
                    "Resolved to:",
                    getImageSource(focusedPost.content)
                  );
                  console.log("Available image keys:", Object.keys(imageMap));
                  // Try a fallback approach
                  if (!e.target.src.includes("placeholder")) {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }
                }}
              />
            )}
          </div>

          <div className="focused-details">
            <div className="focused-user">
              <img
                src={
                  focusedPost.user?.avatar ||
                  "https://via.placeholder.com/40x40?text=U"
                }
                alt={
                  focusedPost.user?.name ||
                  focusedPost.user?.userName ||
                  "Unknown User"
                }
                className="user-avatar-large"
              />
              <div className="user-info-large">
                <h3>
                  {focusedPost.user?.name ||
                    focusedPost.user?.userName ||
                    "Unknown User"}
                </h3>
                <span className="user-role">
                  {focusedPost.user?.role || "Member"}
                </span>
                <span className="post-time-large">
                  {formatTimeAgo(
                    focusedPost.timestamp || new Date(focusedPost.createdAt)
                  )}
                </span>
              </div>
            </div>

            <div className="focused-caption">
              <p>{focusedPost.caption}</p>
            </div>

            <div className="focused-actions">
              <button
                className={`action-btn like-btn ${isLiked ? "liked" : ""}`}
                onClick={handleLikeClick}
              >
                <span className="action-icon">{isLiked ? "❤️" : "♡"}</span>
                <span>Like ({likesCount})</span>
              </button>

              <button className="action-btn comment-btn">
                <span className="action-icon">💬</span>
                <span>Comment ({commentsCount})</span>
              </button>

              <button
                className="action-btn share-btn"
                onClick={handleShareClick}
              >
                <span className="action-icon">🔄</span>
                <span>Share ({sharesCount})</span>
              </button>
            </div>

            <div className="comments-section">
              <h4>Comments</h4>
              <div className="comments-list">
                {focusedPost.comments &&
                Array.isArray(focusedPost.comments) &&
                focusedPost.comments.length > 0 ? (
                  focusedPost.comments.map((comment, index) => (
                    <div key={comment._id || index} className="comment">
                      <div className="comment-user">
                        <strong>
                          {comment.user?.name ||
                            comment.user?.userName ||
                            "Anonymous"}
                        </strong>
                        <span className="comment-time">
                          {formatTimeAgo && comment.commentedAt
                            ? formatTimeAgo(new Date(comment.commentedAt))
                            : "now"}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              <form onSubmit={handleCommentSubmit} className="comment-form">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                  disabled={isSubmittingComment}
                />
                <button
                  type="submit"
                  className="comment-submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? "Posting..." : "Post"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusedPostModal;
