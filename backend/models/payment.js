const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    transactionId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("payment", paymentSchema);
