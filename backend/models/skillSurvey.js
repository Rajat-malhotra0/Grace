const mongoose = require("mongoose");

const skillSurveySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", unique: true },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    helpCategories: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("skillSurvey", skillSurveySchema);
