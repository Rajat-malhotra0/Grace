const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    neededBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ngo",
    },
    urgency: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    donatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    neededTill: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

marketplaceSchema.index({ category: 1 });
marketplaceSchema.index({ neededBy: 1 });
marketplaceSchema.index({ urgency: 1 });
marketplaceSchema.index({ donatedBy: 1 });

module.exports = mongoose.model("marketplace", marketplaceSchema);
