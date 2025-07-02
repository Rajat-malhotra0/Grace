const mongoose = require("mongoose");

const impactStorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    relatedTask: { type: [mongoose.Schema.Types.ObjectId], ref: "task" },
    createdAt: { type: Date, default: Date.now, immutable: true },
    category: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("impactStory", impactStorySchema);
