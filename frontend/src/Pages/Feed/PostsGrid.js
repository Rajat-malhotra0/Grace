import React from "react";
import "./PostsGrid.css";
import PostCard from "./PostCard";

function PostsGrid({ posts, focusedPost, onPostClick, onLike, onShare, formatTimeAgo }) {
  return (
    <div className={`posts-grid ${focusedPost ? 'blurred' : ''}`}>
      {posts.map((post) => (
        <PostCard
          key={post.id || post._id}
          post={post}
          onPostClick={onPostClick}
          onLike={onLike}
          onShare={onShare}
          formatTimeAgo={formatTimeAgo}
        />
      ))}
    </div>
  );
}

export default PostsGrid;
