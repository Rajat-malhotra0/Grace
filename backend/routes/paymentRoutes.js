const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const paymentService = require("../services/paymentService");

router.post("/",
    [
        body("amount").isNumeric().withMessage("Amount must be a number"),
        body("currency").isString().withMessage("Currency must be a string"),
        body("paymentMethod").isString().withMessage("Payment method must be a string"),
        body("transactionId").isString().withMessage("Transaction ID must be a string"),
    ], async (req, res) => {
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
            res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: payment,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create payment",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.get("/",
    [
        query("amount").optional().isNumeric().withMessage("Amount must be a number"),
        query("currency").optional().isString().withMessage("Currency must be a string"),
        query("paymentMethod").optional().isString().withMessage("Payment method must be a string"),
    ], async (req, res) => {
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
        res.status(200).json({
            success: true,
            message: "Payments retrieved successfully",
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.get("/:id",
    [
        param("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID format"),
    ], async (req, res) => {
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
            res.status(200).json({
                success: true,
                message: "Payment retrieved successfully",
                data: payments,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.put("/:id",
    [
        param("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID format"),
        body("amount").optional().isNumeric().withMessage("Amount must be a number"),
        body("currency").optional().isString().withMessage("Currency must be a string"),
        body("paymentMethod").optional().isString().withMessage("Payment method must be a string"),
    ], async (req, res) => {
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
            res.status(200).json({
                success: true,
                message: "Payment updated successfully",
                data: payment,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.delete("/:id",
    [
        param("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID format"),
    ], async (req, res) => {
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
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
