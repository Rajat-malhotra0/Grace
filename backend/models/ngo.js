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
    quote: { type: String, default: "" },
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
        publicId: { type: String, default: "" },
        alt: { type: String, default: "" },
    },
    heroVideo: {
        type: String,
        default: "",
    },
    aboutUs: {
        description: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    projects: [
        {
            id: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            image: { type: String, default: "" },
        },
    ],
    volunteer: {
        subheader: { type: String, default: "" },
        opportunities: [
            {
                id: { type: Number, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                peopleNeeded: { type: String, default: "" },
                duration: { type: String, default: "" },
                eventDate: { type: Date },
                location: { type: String, default: "" },
                isOnline: { type: Boolean, default: false },
                tags: [{ type: String }],
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
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
    inventory: {
        medicine: [{
            itemName: String,
            category: String,
            quantity: Number,
            unitType: String,
            expiryDate: Date,
            batchNumber: String,
            manufacturer: String,
            storageLocation: String,
            loggedBy: String,
            dateReceived: Date,
            source: String,
            prescribedUse: String,
            ageGroup: String,
            dosage: String,
            condition: String
        }],
        food: [{
            itemName: String,
            category: String,
            quantity: Number,
            expiryDate: Date,
            dateReceived: Date,
            source: String,
            storageLocation: String,
            loggedBy: String
        }],
        clothes: [{
            itemName: String,
            category: String,
            size: String,
            gender: String,
            quantity: Number,
            condition: String,
            dateReceived: Date,
            source: String,
            storageLocation: String,
            loggedBy: String
        }],
        books: [{
            itemName: String,
            type: String,
            subject: String,
            ageGroup: String,
            language: String,
            quantity: Number,
            condition: String,
            dateReceived: Date,
            source: String,
            storageLocation: String,
            loggedBy: String
        }],
        other: [{
            itemName: String,
            category: String,
            quantity: Number,
            condition: String,
            dateReceived: Date,
            source: String,
            storageLocation: String,
            loggedBy: String
        }]
    },
    mission: { type: String, default: "" },
    volunteersNeeded: { type: Number, default: 0 },
    donationGoal: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
});

ngoSchema.index({ category: 1 });
ngoSchema.index({ "contact.email": 1 });
ngoSchema.index({ isActive: 1, isVerified: 1 });

ngoSchema.pre("save", function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

module.exports = mongoose.model("ngo", ngoSchema);
