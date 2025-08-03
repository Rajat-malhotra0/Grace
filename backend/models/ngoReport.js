const mongoose = require("mongoose");

const ngoReportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            "Facilities",
            "Supplies",
            "Personnel",
            "Safety",
            "Technology",
            "Other",
        ],
    },
    urgency: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"],
    },
    dateOfIncident: { type: Date, required: true },
    reportedBy: { type: String, required: true },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ngo",
        required: true,
    },
    reportedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending",
    },
    resolvedOn: { type: Date },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
});

ngoReportSchema.index({ ngo: 1, status: 1 });
ngoReportSchema.index({ dateOfIncident: -1 });
ngoReportSchema.index({ urgency: 1 });

module.exports = mongoose.model("ngoReport", ngoReportSchema);
