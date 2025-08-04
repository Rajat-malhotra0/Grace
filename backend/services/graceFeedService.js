const GraceFeed = require('../models/Gracefeed');
const User = require('../models/user');
const Category = require('../models/category');

async function createPost(data){
    try{
        const graceFeed = new GraceFeed(data);
        await graceFeed.save();
        return graceFeed.populate('user', 'userName email role');
    } catch (error) {
        console.error("Error creating GraceFeed post:", error);
    }
}

async function readPosts(filter = {}, options = {}) {
    try {
        let query = GraceFeed.find(filter)
            .populate('user', 'userName email role')
            .populate('category', 'name')
            .populate('likes.user', 'userName')
            .populate('comments.user', 'userName')
            .sort({ createdAt: -1 });
            
        if (options.skip) {
            query = query.skip(options.skip);
        }
        if (options.limit) {
            query = query.limit(options.limit);
        }
        
        const posts = await query;
        return posts;
    } catch (error) {
        console.error("Error reading GraceFeed posts:", error);
        throw error;
    }
}

async function updatePost(filter, data) {
    try {
        const Post = await GraceFeed.findOneAndUpdate(filter,data,{
            new: true,
        }
        ).populate('user', 'userName email role')
         .populate('category', 'name');
        return Post;
    } catch (error) {
        console.error("Error updating GraceFeed post:", error);
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
            throw new Error('Post not found');
        }
        const existingLike = post.likes.find(like => like.user.toString() === userId);
        if (existingLike) {
            post.likes = post.likes.filter(like => like.user.toString() !== userId);
        } else {
            post.likes.push({ user: userId });
        }
        await post.save();
        return await post.populate('user', 'userName email role');
    } catch (error) {
        console.error("Error liking/unliking post:", error);
    }
}

async function addComment(postId, userId, commentText) {
    try {
        const post = await GraceFeed.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        post.comments.push({user: userId,text: commentText});
        await post.save();
        return await post.populate([
            { path: 'user', select: 'userName email role' },
            { path: 'comments.user', select: 'userName' }
        ]);
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}

async function sharePost(postId, userId) {
    try {
        const post = await GraceFeed.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        const existingShare = post.shares.find(share => share.user.toString() === userId);
        if (!existingShare) {
            post.shares.push({ user: userId });
            await post.save();
        }
        return await post.populate('user', 'userName email role');
    } catch (error) {
        console.error("Error sharing post:", error);
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

module.exports = {
    createPost,
    readPosts,
    updatePost,
    deletePost,
    likePost,
    addComment,
    sharePost,
    countPosts
};