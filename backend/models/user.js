const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: [String],
        enum: ["donor", "volunteer", "admin", "ngo"],
        default: [],
    },
    location: {
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number },
        },
    },
    token: { type: String, default: null },
    about: { type: String, default: "" },
    score: { type: Number, default: 0 },
    dob: { type: Date, default: null },
    remindMe: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false },
    newsLetter: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.updatedAt = new Date();
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
