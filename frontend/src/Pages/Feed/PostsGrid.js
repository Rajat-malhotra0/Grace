import React from "react";
import "./PostsGrid.css";
import PostCard from "./PostCard";

function PostsGrid({ posts, focusedPost, onPostClick, formatTimeAgo }) {
  return (
    <div className={`posts-grid ${focusedPost ? 'blurred' : ''}`}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPostClick={onPostClick}
          formatTimeAgo={formatTimeAgo}
        />
      ))}
    </div>
  );
}

export default PostsGrid;
