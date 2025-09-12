const GraceFeed = require("../models/Gracefeed");
const User = require("../models/user");
const Category = require("../models/category");

async function createPost(data) {
  try {
    const graceFeed = new GraceFeed(data);
    await graceFeed.save();
    const populatedPost = await graceFeed.populate(
      "user",
      "userName email role"
    );

    // Transform to include computed fields and ensure consistent structure
    const postObj = populatedPost.toJSON(); // This includes virtuals
    return {
      ...postObj,
      // Ensure user name compatibility
      user: {
        ...postObj.user,
        name: postObj.user?.userName || postObj.user?.name,
      },
      // Ensure array and count compatibility
      likesCount: postObj.likeCount || postObj.likes?.length || 0,
      commentsCount: postObj.commentCount || postObj.comments?.length || 0,
      sharesCount: postObj.shareCount || postObj.shares?.length || 0,
      isLiked: postObj.likes && postObj.likes.length > 0,
    };
  } catch (error) {
    console.error("Error creating GraceFeed post:", error);
    throw error;
  }
}

async function readPosts(filter = {}, options = {}) {
  try {
    let query = GraceFeed.find(filter)
      .populate("user", "userName email role")
      .populate("category", "name")
      .populate("likes.user", "userName")
      .populate("comments.user", "userName")
      .populate("shares.user", "userName")
      .sort({ createdAt: -1 });

    if (options.skip) {
      query = query.skip(options.skip);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const posts = await query;

    // Transform posts to include computed fields and ensure consistent structure
    const transformedPosts = posts.map((post) => {
      const postObj = post.toJSON(); // This includes virtuals
      return {
        ...postObj,
        // Ensure consistent ID field
        id: postObj._id.toString(),
        // Ensure user name compatibility
        user: {
          ...postObj.user,
          name: postObj.user?.userName || postObj.user?.name,
          avatar:
            postObj.user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              postObj.user?.userName || "User"
            )}&background=random`,
        },
        // Ensure array and count compatibility with proper defaults
        likesCount: postObj.likeCount || postObj.likes?.length || 0,
        commentsCount: postObj.commentCount || postObj.comments?.length || 0,
        sharesCount: postObj.shareCount || postObj.shares?.length || 0,
        // Properly populate arrays with transformed data
        likes:
          postObj.likes?.map((like) => ({
            ...like,
            user: like.user?._id || like.user,
            userName: like.user?.userName,
          })) || [],
        comments:
          postObj.comments?.map((comment) => ({
            ...comment,
            user: {
              ...comment.user,
              name: comment.user?.userName || comment.user?.name,
            },
          })) || [],
        shares:
          postObj.shares?.map((share) => ({
            ...share,
            user: share.user?._id || share.user,
            userName: share.user?.userName,
          })) || [],
        // Add computed fields for easier frontend handling
        isLiked: false, // Will be set based on current user in frontend
        timestamp: postObj.createdAt, // For compatibility with frontend
      };
    });

    return transformedPosts;
  } catch (error) {
    console.error("Error reading GraceFeed posts:", error);
    throw error;
  }
}

async function updatePost(filter, data) {
  try {
    const post = await GraceFeed.findOneAndUpdate(filter, data, {
      new: true,
    })
      .populate("user", "userName email role")
      .populate("category", "name");

    if (!post) {
      return null;
    }

    // Transform to include computed fields and ensure consistent structure
    const postObj = post.toJSON(); // This includes virtuals
    return {
      ...postObj,
      // Ensure user name compatibility
      user: {
        ...postObj.user,
        name: postObj.user?.userName || postObj.user?.name,
      },
      // Ensure array and count compatibility
      likesCount: postObj.likeCount || postObj.likes?.length || 0,
      commentsCount: postObj.commentCount || postObj.comments?.length || 0,
      sharesCount: postObj.shareCount || postObj.shares?.length || 0,
      isLiked: postObj.likes && postObj.likes.length > 0,
    };
  } catch (error) {
    console.error("Error updating GraceFeed post:", error);
    throw error;
  }
}

async function deletePost(filter) {
  try {
    await GraceFeed.deleteOne(filter);
  } catch (error) {
    console.error("Error deleting GraceFeed post:", error);
  }
}

async function likePost(postId, userId) {
  try {
    const post = await GraceFeed.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const existingLike = post.likes.find(
      (like) => like.user.toString() === userId
    );
    if (existingLike) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    } else {
      post.likes.push({ user: userId });
    }
    await post.save();
    const populatedPost = await post.populate([
      { path: "user", select: "userName email role" },
      { path: "likes.user", select: "userName" },
      { path: "comments.user", select: "userName" },
      { path: "shares.user", select: "userName" },
    ]);

    // Transform to include computed fields and ensure consistent structure
    const postObj = populatedPost.toJSON(); // This includes virtuals
    return {
      ...postObj,
      // Ensure consistent ID field
      id: postObj._id.toString(),
      // Ensure user name compatibility
      user: {
        ...postObj.user,
        name: postObj.user?.userName || postObj.user?.name,
        avatar:
          postObj.user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            postObj.user?.userName || "User"
          )}&background=random`,
      },
      // Ensure array and count compatibility with proper defaults
      likesCount: postObj.likeCount || postObj.likes?.length || 0,
      commentsCount: postObj.commentCount || postObj.comments?.length || 0,
      sharesCount: postObj.shareCount || postObj.shares?.length || 0,
      // Properly populate arrays with transformed data
      likes:
        postObj.likes?.map((like) => ({
          ...like,
          user: like.user?._id || like.user,
          userName: like.user?.userName,
        })) || [],
      comments:
        postObj.comments?.map((comment) => ({
          ...comment,
          user: {
            ...comment.user,
            name: comment.user?.userName || comment.user?.name,
          },
        })) || [],
      shares:
        postObj.shares?.map((share) => ({
          ...share,
          user: share.user?._id || share.user,
          userName: share.user?.userName,
        })) || [],
      // Add computed fields for easier frontend handling
      isLiked:
        postObj.likes?.some((like) => like.user?.toString() === userId) ||
        false,
      timestamp: postObj.createdAt, // For compatibility with frontend
    };
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    throw error;
  }
}

async function addComment(postId, userId, commentText) {
  try {
    const post = await GraceFeed.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    post.comments.push({ user: userId, text: commentText });
    await post.save();
    const populatedPost = await post.populate([
      { path: "user", select: "userName email role" },
      { path: "likes.user", select: "userName" },
      { path: "comments.user", select: "userName" },
      { path: "shares.user", select: "userName" },
    ]);

    // Transform to include computed fields and ensure consistent structure
    const postObj = populatedPost.toJSON(); // This includes virtuals
    return {
      ...postObj,
      // Ensure consistent ID field
      id: postObj._id.toString(),
      // Ensure user name compatibility
      user: {
        ...postObj.user,
        name: postObj.user?.userName || postObj.user?.name,
        avatar:
          postObj.user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            postObj.user?.userName || "User"
          )}&background=random`,
      },
      // Ensure array and count compatibility with proper defaults
      likesCount: postObj.likeCount || postObj.likes?.length || 0,
      commentsCount: postObj.commentCount || postObj.comments?.length || 0,
      sharesCount: postObj.shareCount || postObj.shares?.length || 0,
      // Properly populate arrays with transformed data
      likes:
        postObj.likes?.map((like) => ({
          ...like,
          user: like.user?._id || like.user,
          userName: like.user?.userName,
        })) || [],
      comments:
        postObj.comments?.map((comment) => ({
          ...comment,
          user: {
            ...comment.user,
            name: comment.user?.userName || comment.user?.name,
            _id: comment.user?._id,
          },
        })) || [],
      shares:
        postObj.shares?.map((share) => ({
          ...share,
          user: share.user?._id || share.user,
          userName: share.user?.userName,
        })) || [],
      // Add computed fields for easier frontend handling
      isLiked: false, // Will be set based on current user in frontend
      timestamp: postObj.createdAt, // For compatibility with frontend
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

async function sharePost(postId, userId) {
  try {
    const post = await GraceFeed.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const existingShare = post.shares.find(
      (share) => share.user.toString() === userId
    );
    if (!existingShare) {
      post.shares.push({ user: userId });
      await post.save();
    }
    const populatedPost = await post.populate([
      { path: "user", select: "userName email role" },
      { path: "likes.user", select: "userName" },
      { path: "comments.user", select: "userName" },
      { path: "shares.user", select: "userName" },
    ]);

    // Transform to include computed fields and ensure consistent structure
    const postObj = populatedPost.toJSON(); // This includes virtuals
    return {
      ...postObj,
      // Ensure consistent ID field
      id: postObj._id.toString(),
      // Ensure user name compatibility
      user: {
        ...postObj.user,
        name: postObj.user?.userName || postObj.user?.name,
        avatar:
          postObj.user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            postObj.user?.userName || "User"
          )}&background=random`,
      },
      // Ensure array and count compatibility with proper defaults
      likesCount: postObj.likeCount || postObj.likes?.length || 0,
      commentsCount: postObj.commentCount || postObj.comments?.length || 0,
      sharesCount: postObj.shareCount || postObj.shares?.length || 0,
      // Properly populate arrays with transformed data
      likes:
        postObj.likes?.map((like) => ({
          ...like,
          user: like.user?._id || like.user,
          userName: like.user?.userName,
        })) || [],
      comments:
        postObj.comments?.map((comment) => ({
          ...comment,
          user: {
            ...comment.user,
            name: comment.user?.userName || comment.user?.name,
          },
        })) || [],
      shares:
        postObj.shares?.map((share) => ({
          ...share,
          user: share.user?._id || share.user,
          userName: share.user?.userName,
        })) || [],
      // Add computed fields for easier frontend handling
      isLiked: false, // Will be set based on current user in frontend
      timestamp: postObj.createdAt, // For compatibility with frontend
    };
  } catch (error) {
    console.error("Error sharing post:", error);
    throw error;
  }
}

async function countPosts(filter = {}) {
  try {
    const count = await GraceFeed.countDocuments(filter);
    return count;
  } catch (error) {
    console.error("Error counting GraceFeed posts:", error);
    throw error;
  }
}

async function getPostById(postId) {
  try {
    const post = await GraceFeed.findById(postId)
      .populate("user", "userName email role")
      .populate("category", "name")
      .populate("likes.user", "userName")
      .populate("comments.user", "userName")
      .populate("shares.user", "userName");

    if (!post) {
      return null;
    }

    // Transform to include computed fields and ensure consistent structure
    const postObj = post.toJSON(); // This includes virtuals
    return {
      ...postObj,
      // Ensure consistent ID field
      id: postObj._id.toString(),
      // Ensure user name compatibility
      user: {
        ...postObj.user,
        name: postObj.user?.userName || postObj.user?.name,
        avatar:
          postObj.user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            postObj.user?.userName || "User"
          )}&background=random`,
      },
      // Ensure array and count compatibility with proper defaults
      likesCount: postObj.likeCount || postObj.likes?.length || 0,
      commentsCount: postObj.commentCount || postObj.comments?.length || 0,
      sharesCount: postObj.shareCount || postObj.shares?.length || 0,
      // Properly populate arrays with transformed data
      likes:
        postObj.likes?.map((like) => ({
          ...like,
          user: like.user?._id || like.user,
          userName: like.user?.userName,
        })) || [],
      comments:
        postObj.comments?.map((comment) => ({
          ...comment,
          user: {
            ...comment.user,
            name: comment.user?.userName || comment.user?.name,
          },
        })) || [],
      shares:
        postObj.shares?.map((share) => ({
          ...share,
          user: share.user?._id || share.user,
          userName: share.user?.userName,
        })) || [],
      // Add computed fields for easier frontend handling
      isLiked: false, // Will be set based on current user in frontend
      timestamp: postObj.createdAt, // For compatibility with frontend
    };
  } catch (error) {
    console.error("Error getting post by ID:", error);
    throw error;
  }
}

module.exports = {
  createPost,
  readPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  sharePost,
  countPosts,
};
