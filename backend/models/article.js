const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: [
                "tasks",
                "navigation",
                "ngo",
                "analytics",
                "general",
                "donations",
                "users",
            ],
        },
        source: { type: String, default: "User Guide" },
        tags: [{ type: String }],
        isActive: { type: Boolean, default: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

articleSchema.index({ title: "text", content: "text", tags: "text" });
articleSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Article", articleSchema);
