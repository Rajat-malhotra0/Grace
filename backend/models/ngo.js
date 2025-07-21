const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    registerationId: { type: String, default: "" },
    yearEstablished: { type: Number, default: 0 },
    description: { type: String, default: "" },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    location: {
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        coordinates: {
            //Probably from google maps
            latitude: { type: Number },
            longitude: { type: Number },
        },
    },
    contact: {
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        website: { type: String, default: "" },
    },
    otherCauses: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
});

ngoSchema.index({ category: 1 });
ngoSchema.index({ "location.city": 1 });
ngoSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model("ngo", ngoSchema);
