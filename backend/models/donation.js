const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    amount: { type: Number },
    donationType: {
        type: String,
        enum: ["monetary", "goods"],
        default: "monetary",
    },
    currency: { type: String, default: "INR" },
    description: { type: String, default: "" },
    isAnonymous: { type: Boolean, default: false },
    receiptGenerated: { type: Boolean, defualt: false },
    createdAt: { type: Date, default: Date.now, immutable: true },
    transactionId: { type: String, unique: true },
});

donationSchema.index({ ngo: 1 });
donationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("donation", donationSchema);
