const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "ngo" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    transactionId: { type: String, unique: true },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("payment", paymentSchema);
