const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const ngoService = require("../services/ngoService");

router.post(
    "/",
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 3 })
            .withMessage("Name must be at least 3 characters long"),
        body("category")
            .notEmpty()
            .withMessage("Category is required")
            .isMongoId()
            .withMessage("Invalid category ID format"),
        body("location.address")
            .trim()
            .notEmpty()
            .withMessage("Address is required"),
        body("contact.email")
            .trim()
            .isEmail()
            .withMessage("Valid email is required"),
        body("contact.phone")
            .trim()
            .notEmpty()
            .withMessage("Contact number is required"),
        body("isVerified")
            .optional()
            .isBoolean()
            .withMessage("isVerified must be a boolean"),
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
            const ngo = await ngoService.createNgo(req.body);
            if (ngo) {
                res.status(201).json({
                    success: true,
                    message: "NGO created successfully",
                    result: ngo,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Failed to create NGO",
                });
            }
        } catch (error) {
            res.status(500).json({
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
        query("name").optional().trim(),
        query("category")
            .optional()
            .isMongoId()
            .withMessage("Invalid category ID format"),
        query("location.address").optional().trim(),
        query("contact.email")
            .optional()
            .isEmail()
            .withMessage("Invalid email format"),
        query("contact.phone").optional().trim(),
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
            const ngos = await ngoService.readNgos(filter);
            res.status(200).json({
                success: true,
                message: "NGOs retrieved successfully",
                result: ngos,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

router.get(
    "/:id",
    [param("id").notEmpty().withMessage("ID is required")],
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
            const ngos = await ngoService.readNgos({ _id: req.params.id });
            if (ngos && ngos.length > 0) {
                res.status(200).json({
                    success: true,
                    message: "NGO retrieved successfully",
                    result: ngos[0],
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "NGO not found",
                });
            }
        } catch (error) {
            res.status(500).json({
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
        body("name")
            .optional()
            .trim()
            .isLength({ min: 3 })
            .withMessage("Name must be at least 3 characters long"),
        body("category")
            .optional()
            .isMongoId()
            .withMessage("Invalid category ID format"),
        body("location.address")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Address is required"),
        body("contact.email")
            .optional()
            .isEmail()
            .withMessage("Valid email is required"),
        body("contact.phone")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Phone number is required"),
        body("isVerified")
            .optional()
            .isBoolean()
            .withMessage("isVerified must be a boolean"),
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
            const ngo = await ngoService.updateNgo(
                { _id: req.params.id },
                req.body
            );
            if (ngo) {
                res.status(200).json({
                    success: true,
                    message: "NGO updated successfully",
                    result: ngo,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "NGO not found",
                });
            }
        } catch (error) {
            res.status(500).json({
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
            await ngoService.deleteNgo({ _id: req.params.id });
            res.status(200).json({
                success: true,
                message: "NGO deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

module.exports = router;
