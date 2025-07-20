const mongoose = require("mongoose");

const skillSurveySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
    },
    answers: { type: [] },
    skills: [{ type: String }],
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    helpCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    availabilityHours: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("skillSurvey", skillSurveySchema);
