const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const paymentService = require("../services/paymentService");
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post(
    "/create-order",
    [body("amount").isNumeric().withMessage("Amount must be a number")],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const options = {
                amount: Number(req.body.amount) * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: `receipt_order_${new Date().getTime()}`,
            };
            const order = await razorpayInstance.orders.create(options);
            if (!order) {
                return res.status(500).send("Error creating order");
            }
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
);

router.post("/verify-payment", async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        user, // Assuming you send the user ID from the frontend
    } = req.body;

    // As requested, skipping signature verification.
    // In a real application, you MUST verify the signature.

    try {
        const paymentData = {
            user,
            amount: amount / 100, // Convert back to rupees
            currency: "INR",
            status: "completed",
            transactionId: razorpay_payment_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        };

        const payment = await paymentService.createPayment(paymentData);
        res.status(201).json({
            success: true,
            message: "Payment successful and recorded",
            result: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post(
    "/",
    [
        body("amount").isNumeric().withMessage("Amount must be a number"),
        body("currency").isString().withMessage("Currency must be a string"),
        body("paymentMethod")
            .isString()
            .withMessage("Payment method must be a string"),
        body("transactionId")
            .isString()
            .withMessage("Transaction ID must be a string"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
            const payment = await paymentService.createPayment(req.body);
            if (payment) {
                return res.status(201).json({
                    success: true,
                    message: "Payment created successfully",
                    result: payment,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create payment",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

router.get(
    "/",
    [
        query("amount")
            .optional()
            .isNumeric()
            .withMessage("Amount must be a number"),
        query("currency")
            .optional()
            .isString()
            .withMessage("Currency must be a string"),
        query("paymentMethod")
            .optional()
            .isString()
            .withMessage("Payment method must be a string"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
            const filter = req.query;
            const payments = await paymentService.readPayments(filter);
            return res.status(200).json({
                success: true,
                message: "Payments retrieved successfully",
                result: payments,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

router.get(
    "/:id",
    [
        param("id")
            .notEmpty()
            .withMessage("ID is required")
            .isMongoId()
            .withMessage("Invalid ID format"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
            const payments = await paymentService.readPayments({
                _id: req.params.id,
            });
            if (payments && payments.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Payment retrieved successfully",
                    result: payments,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

router.put(
    "/:id",
    [
        param("id")
            .notEmpty()
            .withMessage("ID is required")
            .isMongoId()
            .withMessage("Invalid ID format"),
        body("amount")
            .optional()
            .isNumeric()
            .withMessage("Amount must be a number"),
        body("currency")
            .optional()
            .isString()
            .withMessage("Currency must be a string"),
        body("paymentMethod")
            .optional()
            .isString()
            .withMessage("Payment method must be a string"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
            const payment = await paymentService.updatePayment(
                { _id: req.params.id },
                req.body
            );
            if (payment) {
                return res.status(200).json({
                    success: true,
                    message: "Payment updated successfully",
                    result: payment,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

router.delete(
    "/:id",
    [
        param("id")
            .notEmpty()
            .withMessage("ID is required")
            .isMongoId()
            .withMessage("Invalid ID format"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
            await paymentService.deletePayment({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "Payment deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

module.exports = router;
