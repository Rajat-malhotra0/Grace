const mongoose = require('mongoose');

const graceFeedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {type: String, enum: ['photo', 'video', 'text'], default: 'photo'},
    content: {type: String, required: true},
    caption: {type: String, default: ''},
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {type: Date, default: Date.now}
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {type: String, required: true},
        commentedAt: {type: Date,default: Date.now}
    }],
    shares: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        sharedAt: {type: Date, default: Date.now}
    }],
    size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
    },
    tags: [{ type: String }],
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category'
    },
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now, immutable: true},
    updatedAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

graceFeedSchema.index({ user: 1 });
graceFeedSchema.index({ createdAt: -1 });  

graceFeedSchema.virtual('likeCount').get(function() { // this is a virtual property to get the count of likes
    return this.likes.length; // it does not store the count in the database, it calculates it on the fly or when requested in json responses
}); // rest same as before
graceFeedSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});
graceFeedSchema.virtual('shareCount').get(function() {
    return this.shares.length;
});
graceFeedSchema.set('toJSON', { virtuals: true }); // Ensure virtuals are included in JSON output
graceFeedSchema.set('toObject', { virtuals: true });// Ensure virtuals are included in object output
graceFeedSchema.pre('save', function(next) { // Update the updatedAt field before saving
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('graceFeed', graceFeedSchema);