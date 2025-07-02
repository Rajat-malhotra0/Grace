const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
        type: String,
        enum: ["free", "in-progress", "done"],
        default: "free",
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    dueDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("task", taskSchema);
