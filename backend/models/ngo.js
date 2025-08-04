const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
    },
    name: { type: String, required: true },
    registerationId: { type: String, default: "" },
    yearEstablished: { type: Number, default: 0 },
    description: { type: String, default: "" },
    quote: { type: String, default: "" }, // Added for NGO quotes
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
    ],
    contact: {
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        website: { type: String, default: "" },
    },
    otherCauses: { type: String, default: "" },
    coverImage: {
        url: { type: String, default: "" }, // Cloudinary URL
        publicId: { type: String, default: "" }, // For deletion from Cloudinary
        alt: { type: String, default: "" }, // Alt text for accessibility
    },
    // Additional media content
    heroVideo: {
        type: String,
        default: "",
    }, // URL for hero video
    // About Us section
    aboutUs: {
        description: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    // Projects array
    projects: [
        {
            id: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            image: { type: String, default: "" },
        },
    ],
    // Volunteer opportunities
    volunteer: {
        subheader: { type: String, default: "" },
        opportunities: [
            {
                id: { type: Number, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                peopleNeeded: { type: String, default: "" },
                duration: { type: String, default: "" },
            },
        ],
    },
    // Donation options
    donate: {
        options: [
            {
                id: { type: Number, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                image: { type: String, default: "" },
                buttonText: { type: String, default: "Donate" },
            },
        ],
    },
    // Additional fields for carousel display
    mission: { type: String, default: "" }, // Short mission statement
    volunteersNeeded: { type: Number, default: 0 }, // Number of volunteers needed
    donationGoal: { type: Number, default: 0 }, // Donation goal amount
    // Status fields
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
});

// Indexes for better query performance
ngoSchema.index({ category: 1 });
ngoSchema.index({ "contact.email": 1 });
ngoSchema.index({ isActive: 1, isVerified: 1 });
ngoSchema.index({ name: "text", description: "text" }); // Text search

// Pre-save middleware to update updatedAt
ngoSchema.pre("save", function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

module.exports = mongoose.model("ngo", ngoSchema);
