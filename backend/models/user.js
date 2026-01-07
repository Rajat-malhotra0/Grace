const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

    mobileNumber: { type: String, default: "" },
    mobileVerified: { type: Boolean, default: false },

    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationTokenExp: { type: Date, default: null },
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

// Issue email verification token (returns raw token)
userSchema.methods.issueEmailVerificationToken = function (ttlMinutes = 30) {
    const raw = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    this.emailVerificationTokenHash = hash;
    this.emailVerificationTokenExp = new Date(
        Date.now() + ttlMinutes * 60 * 1000
    );
    return raw;
};

userSchema.methods.verifyEmailToken = function (rawToken) {
    if (
        !rawToken ||
        !this.emailVerificationTokenHash ||
        !this.emailVerificationTokenExp
    ) {
        return false;
    }
    if (this.emailVerificationTokenExp < new Date()) {
        return false;
    }
    const providedHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
    return providedHash === this.emailVerificationTokenHash;
};

userSchema.methods.markEmailVerified = function () {
    this.emailVerified = true;
    this.emailVerificationTokenHash = null;
    this.emailVerificationTokenExp = null;
};

userSchema.index({ role: 1 });
userSchema.index({ score: -1 });

module.exports = mongoose.model("user", userSchema);
