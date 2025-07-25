const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    type: {
        type: String,
        enum: ["task", "ngo", "interest"],
        required: true,
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("Category", categorySchema);
