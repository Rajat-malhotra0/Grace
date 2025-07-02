const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: {
        type: [String],
        enum: ["donor", "volunteer", "admin"],
        default: [],
    },
    interest: { type: [String] },
    about: { type: String, default: "" },
    assignedTask: { type: [mongoose.Schema.Types.ObjectId], ref: "task" },
    completedTask: { type: [mongoose.Schema.Types.ObjectId], ref: "task" },
    duration: { type: [mongoose.Schema.Types.ObjectId], ref: "donation" },
    createdAt: { type: Date, default: Date.now, immutable: true },
    score: { type: Number, default: 0 },
});

module.exports = mongoose.model("user", userSchema);
