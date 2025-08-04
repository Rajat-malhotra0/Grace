const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const ngoReportService = require("../services/ngoReportService");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post(
    "/",
    authMiddleware,
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("category")
            .isIn([
                "Facilities",
                "Supplies",
                "Personnel",
                "Safety",
                "Technology",
                "Other",
            ])
            .withMessage(
                "Category must be one of: Facilities, Supplies, Personnel, Safety, Technology, Other"
            ),
        body("urgency")
            .isIn(["Low", "Medium", "High"])
            .withMessage("Urgency must be one of: Low, Medium, High"),
        body("dateOfIncident")
            .isISO8601()
            .withMessage("Valid date is required"),
        body("reportedBy")
            .trim()
            .notEmpty()
            .withMessage("Reported by is required"),
        body("ngo").isMongoId().withMessage("Valid NGO ID is required"),
        body("reportedByUser")
            .isMongoId()
            .withMessage("Valid user ID is required"),
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
            const ngoReport = await ngoReportService.createNgoReport(req.body);
            if (ngoReport) {
                return res.status(201).json({
                    success: true,
                    message: "NGO report created successfully",
                    result: ngoReport,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create NGO report",
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
    authMiddleware,
    [
        query("ngo")
            .optional()
            .isMongoId()
            .withMessage("Invalid NGO ID format"),
        query("status")
            .optional()
            .isIn(["pending", "resolved"])
            .withMessage("Status must be either pending or resolved"),
        query("category")
            .optional()
            .isIn([
                "Facilities",
                "Supplies",
                "Personnel",
                "Safety",
                "Technology",
                "Other",
            ])
            .withMessage("Invalid category"),
        query("urgency")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Invalid urgency level"),
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
            const ngoReports = await ngoReportService.readNgoReports(filter);
            return res.status(200).json({
                success: true,
                message: "NGO reports retrieved successfully",
                result: ngoReports,
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
    authMiddleware,
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
            const ngoReports = await ngoReportService.readNgoReports({
                _id: req.params.id,
            });
            if (ngoReports && ngoReports.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "NGO report retrieved successfully",
                    result: ngoReports[0],
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "NGO report not found",
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
    "/:id/resolve",
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
            const ngoReport = await ngoReportService.resolveNgoReport(
                req.params.id
            );
            if (ngoReport) {
                return res.status(200).json({
                    success: true,
                    message: "NGO report resolved successfully",
                    result: ngoReport,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "NGO report not found",
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
        body("title")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Title cannot be empty"),
        body("description")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Description cannot be empty"),
        body("category")
            .optional()
            .isIn([
                "Facilities",
                "Supplies",
                "Personnel",
                "Safety",
                "Technology",
                "Other",
            ])
            .withMessage("Invalid category"),
        body("urgency")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Invalid urgency level"),
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
            const updateData = { ...req.body, updatedAt: new Date() };
            const ngoReport = await ngoReportService.updateNgoReport(
                { _id: req.params.id },
                updateData
            );
            if (ngoReport) {
                return res.status(200).json({
                    success: true,
                    message: "NGO report updated successfully",
                    result: ngoReport,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "NGO report not found",
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
            await ngoReportService.deleteNgoReport({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "NGO report deleted successfully",
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
