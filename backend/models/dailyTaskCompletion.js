const mongoose = require("mongoose");

const dailyTaskCompletionSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: "task", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    completedAt: { type: Date, default: Date.now },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    pointsEarned: { type: Number, default: 10 },
});

// Ensure a user can only complete a daily task once per day
dailyTaskCompletionSchema.index(
    { task: 1, user: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "DailyTaskCompletion",
    dailyTaskCompletionSchema
);
