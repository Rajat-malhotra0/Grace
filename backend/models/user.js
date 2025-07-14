const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: [String],
        enum: ["donor", "volunteer", "admin"],
        default: [],
    },
    refreshTokens: [
        {
            token: { type: String, required: true },
            issuedAt: { type: Date, default: Date.now },
            expiresAt: { type: Date, required: true },
        },
    ],
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
    next();

    //Someone add hashing here

    this.updatedAt = new Date();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });

module.exports = mongoose.model("user", userSchema);
