const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: {
        type: [String],
        enum: ["donor", "volunteer", "admin"],
        default: [],
    },
    refreshTokens: [{
        token: { type: String, required: true },
        issuedAt: { type: Date, default: Date.now }
    }],
    interest: { type: [String] },
    about: { type: String, default: "" },
    assignedTask: { type: [mongoose.Schema.Types.ObjectId], ref: "task" },
    completedTask: { type: [mongoose.Schema.Types.ObjectId], ref: "task" },
    duration: { type: [mongoose.Schema.Types.ObjectId], ref: "donation" },
    createdAt: { type: Date, default: Date.now, immutable: true },
    score: { type: Number, default: 0 },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
