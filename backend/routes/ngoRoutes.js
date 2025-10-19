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
            .isArray({ min: 1 })
            .withMessage("At least one category is required"),
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
                return res.status(201).json({
                    success: true,
                    message: "NGO created successfully",
                    result: ngo,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create NGO",
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
            console.log("GET /api/ngos - Request query:", req.query);
            const filter = req.query;
            console.log(
                "GET /api/ngos - Calling ngoService.readNgos with filter:",
                filter
            );
            const ngos = await ngoService.readNgos(filter);
            console.log(
                "GET /api/ngos - Successfully retrieved NGOs, count:",
                ngos?.length || 0
            );
            return res.status(200).json({
                success: true,
                message: "NGOs retrieved successfully",
                result: ngos,
            });
        } catch (error) {
            console.error("GET /api/ngos - Error occurred:", error);
            console.error("GET /api/ngos - Error stack:", error.stack);
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
                return res.status(200).json({
                    success: true,
                    message: "NGO retrieved successfully",
                    result: ngos[0],
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "NGO not found",
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
                return res.status(200).json({
                    success: true,
                    message: "NGO updated successfully",
                    result: ngo,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "NGO not found",
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
            await ngoService.deleteNgo({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "NGO deleted successfully",
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

// Volunteer Opportunities Routes
router.post(
    "/:id/volunteer-opportunities",
    [
        param("id")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID format"),
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("peopleNeeded")
            .trim()
            .notEmpty()
            .withMessage("People needed is required"),
        body("duration").trim().notEmpty().withMessage("Duration is required"),
        body("tags").optional().isArray().withMessage("Tags must be an array"),
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
            const ngo = await ngoService.addVolunteerOpportunity(
                req.params.id,
                req.body
            );
            return res.status(201).json({
                success: true,
                message: "Volunteer opportunity added successfully",
                result: ngo.volunteer.opportunities,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
                error: error.message,
            });
        }
    }
);

router.get(
    "/:id/volunteer-opportunities",
    [
        param("id")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID format"),
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
            const opportunities = await ngoService.getVolunteerOpportunities(
                req.params.id
            );
            return res.status(200).json({
                success: true,
                message: "Volunteer opportunities retrieved successfully",
                result: opportunities,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
                error: error.message,
            });
        }
    }
);

router.put(
    "/:id/volunteer-opportunities/:opportunityId",
    [
        param("id")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID format"),
        param("opportunityId")
            .notEmpty()
            .withMessage("Opportunity ID is required")
            .isInt()
            .withMessage("Opportunity ID must be a number"),
        body("title")
            .optional()
            .trim()
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long"),
        body("description").optional().trim(),
        body("peopleNeeded").optional().trim(),
        body("duration").optional().trim(),
        body("tags").optional().isArray().withMessage("Tags must be an array"),
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
            const ngo = await ngoService.updateVolunteerOpportunity(
                req.params.id,
                parseInt(req.params.opportunityId),
                req.body
            );
            return res.status(200).json({
                success: true,
                message: "Volunteer opportunity updated successfully",
                result: ngo.volunteer.opportunities,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
                error: error.message,
            });
        }
    }
);

router.delete(
    "/:id/volunteer-opportunities/:opportunityId",
    [
        param("id")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID format"),
        param("opportunityId")
            .notEmpty()
            .withMessage("Opportunity ID is required")
            .isInt()
            .withMessage("Opportunity ID must be a number"),
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
            const ngo = await ngoService.deleteVolunteerOpportunity(
                req.params.id,
                parseInt(req.params.opportunityId)
            );
            return res.status(200).json({
                success: true,
                message: "Volunteer opportunity deleted successfully",
                result: ngo.volunteer.opportunities,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
                error: error.message,
            });
        }
    }
);

module.exports = router;
