const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: [String],
        enum: ["donor", "volunteer", "admin", "ngo", "ngoMember"],
        default: [],
    },
    volunteerType: { type: String, default: "" },
    organization: {
        name: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        department: { type: String, default: "" },
        role: { type: String, default: "" },
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
    score: { type: Number, default: 0 },

    // Simple leaderboard stats
    leaderboardStats: {
        hours: { type: Number, default: 0 },
        tasksCompleted: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0, min: 0, max: 10 },
        currentStreak: { type: Number, default: 0 },
        level: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert",
                "Champion",
            ],
            default: "Beginner",
        },
    },

    lastActiveDate: { type: Date },

    token: { type: String, default: null },
    about: { type: String, default: "" },
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
userSchema.index({ score: -1 });

module.exports = mongoose.model("user", userSchema);
