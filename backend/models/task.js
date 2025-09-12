const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "ngo", required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
        type: String,
        enum: ["free", "in-progress", "done", "cancelled"],
        default: "free",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    isDaily: { type: Boolean, default: false },
    dayOfWeek: {
        type: [
            {
                type: String,
                enum: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
            },
        ],
    },
    estimatedMinutes: { type: Number, default: 0 },
    actualMinutes: { type: Number, default: 0 },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    completedAt: { type: Date },
});

taskSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    if (this.status === "completed" && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

taskSchema.index({ ngo: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ category: 1 });

module.exports = mongoose.model("task", taskSchema);
