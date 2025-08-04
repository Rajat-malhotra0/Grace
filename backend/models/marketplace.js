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
        enum: [
            "Food & Nutrition",
            "Clothing & Apparel",
            "Books & Stationery",
            "Medical & Hygiene Supplies",
            "Technology",
            "Furniture & Essentials",
            "Toys & Recreation",
            "Skill Tools",
            "Other Items",
        ],
    },
    neededBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ngo",
    },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    status: {
        type: String,
        enum: ["pending", "fulfilled", "expired"],
        default: "pending",
    },
    donatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    location: {
        type: String,
        required: true,
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    neededTill: {
        type: Date,
        required: true,
    },
    fulfilledDate: {
        type: Date,
        default: null,
    },
    fulfillmentTime: {
        type: Number,
        default: null,
    },
    ngoImage: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware to update fulfillmentTime when item is fulfilled
marketplaceSchema.pre("save", function (next) {
    if (
        this.isModified("status") &&
        this.status === "fulfilled" &&
        !this.fulfilledDate
    ) {
        this.fulfilledDate = new Date();
        this.fulfillmentTime = Math.ceil(
            (this.fulfilledDate - this.datePosted) / (1000 * 60 * 60 * 24)
        );
    }
    this.updatedAt = new Date();
    next();
});

marketplaceSchema.index({ category: 1 });
marketplaceSchema.index({ neededBy: 1 });
marketplaceSchema.index({ urgency: 1 });
marketplaceSchema.index({ status: 1 });
marketplaceSchema.index({ location: 1 });

module.exports = mongoose.model("marketplace", marketplaceSchema);
