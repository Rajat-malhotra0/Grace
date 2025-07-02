const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    location: { type: String, default: "" },
    contact: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("ngo", ngoSchema);
