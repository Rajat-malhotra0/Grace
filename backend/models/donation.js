const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, immutable: true },
    currency: { type: String, default: "INR" },
    transactionId: { type: String, unique: true },
});

module.exports = mongoose.model("donation", donationSchema);
