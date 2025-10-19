const mongoose = require("mongoose");

const volunteerApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ngo",
        required: true,
    },
    opportunityId: {
        type: Number,
        required: true,
    },
    opportunityTitle: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    message: {
        type: String,
        default: "",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
});

// Prevent duplicate applications for the same opportunity
volunteerApplicationSchema.index(
    { user: 1, ngo: 1, opportunityId: 1 },
    { unique: true }
);

volunteerApplicationSchema.index({ ngo: 1, status: 1 });
volunteerApplicationSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model(
    "volunteerApplication",
    volunteerApplicationSchema
);
