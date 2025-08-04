import React, { useState } from "react";
import "./FocusedPostModal.css";

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
    const likesCount = focusedPost.likes?.length || focusedPost.likes || 0;
    const commentsCount =
        focusedPost.comments?.length || focusedPost.comments || 0;
    const sharesCount = focusedPost.shares?.length || focusedPost.shares || 0;
    const isLiked =
        focusedPost.isLiked ||
        (focusedPost.likes &&
            Array.isArray(focusedPost.likes) &&
            focusedPost.likes.length > 0);

    return (
        <div className="focused-post-overlay" onClick={onClose}>
            <div className="focused-post" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}></button>

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
                                        focusedPost.timestamp ||
                                            new Date(focusedPost.createdAt)
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
                                    isLiked ? "liked" : ""
                                }`}
                                onClick={handleLikeClick}
                            >
                                <span className="action-icon">
                                    {isLiked ? "❤️" : "♡"}
                                </span>
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
                                Array.isArray(focusedPost.comments) ? (
                                    focusedPost.comments.map(
                                        (comment, index) => (
                                            <div
                                                key={index}
                                                className="comment"
                                            >
                                                <div className="comment-user">
                                                    <strong>
                                                        {comment.user
                                                            ?.userName ||
                                                            comment.user
                                                                ?.name ||
                                                            "Anonymous"}
                                                    </strong>
                                                    <span className="comment-time">
                                                        {formatTimeAgo(
                                                            new Date(
                                                                comment.commentedAt
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="comment-text">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="no-comments">
                                        No comments yet
                                    </p>
                                )}
                            </div>

                            <form
                                onSubmit={handleCommentSubmit}
                                className="comment-form"
                            >
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    placeholder="Add a comment..."
                                    className="comment-input"
                                    disabled={isSubmittingComment}
                                />
                                <button
                                    type="submit"
                                    className="comment-submit"
                                    disabled={
                                        !commentText.trim() ||
                                        isSubmittingComment
                                    }
                                >
                                    {isSubmittingComment
                                        ? "Posting..."
                                        : "Post"}
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
