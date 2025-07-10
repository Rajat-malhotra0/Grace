const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const donationService = require("../services/donationService");

router.post("/",
    [
        body("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Amount must be a number"),
        body("donorId").notEmpty().withMessage("Donor ID is required").isMongoId().withMessage("Invalid Donor ID format"),
        body("ngoId").notEmpty().withMessage("NGO ID is required").isMongoId().withMessage("Invalid NGO ID format"),
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    try {
        const donation = await donationService.createDonation(req.body);
        if (donation) {
            res.status(201).json({
                success: true,
                message: "Donation created successfully",
                data: donation,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create donation",
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
        query("donorId").optional().isMongoId().withMessage("Invalid Donor ID format"),
        query("ngoId").optional().isMongoId().withMessage("Invalid NGO ID format"),
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    try {
        const filter = req.query;
        const donations = await donationService.readDonations(filter);
        res.status(200).json({
            success: true,
            message: "Donations retrieved successfully",
            data: donations,
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
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    try {
        const donations = await donationService.readDonations({
            _id: req.params.id,
        });
        if (donations && donations.length > 0) {
            res.status(200).json({
                success: true,
                message: "Donation retrieved successfully",
                data: donations[0],
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Donation not found",
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
        body("donorId").optional().isMongoId().withMessage("Invalid Donor ID format"),
        body("ngoId").optional().isMongoId().withMessage("Invalid NGO ID format"),
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    try {
        const donation = await donationService.updateDonation(
            { _id: req.params.id },
            req.body
        );
        if (donation) {
            res.status(200).json({
                success: true,
                message: "Donation updated successfully",
                data: donation,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Donation not found",
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
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    try {
        await donationService.deleteDonation({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Donation deleted successfully",
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
