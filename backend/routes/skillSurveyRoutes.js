const express = require("express");
const router = express.Router();
const { body, query,param, validationResult } = require("express-validator");
const skillSurveyService = require("../services/skillSurveyService");

router.post("/",
    [
        body('user').notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID format"),
        body('skills').isArray().withMessage("Skills is not an array"),
        body('interests').optional().isArray().withMessage("Interests is not an array"),
        body('helpCategories').optional().isArray().withMessage("Help categories is not an array"),
        body('availabilityHours').optional().isInt({ min: 0 }).withMessage("Availability hours is not valid"),
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
        const skillSurvey = await skillSurveyService.createSkillSurvey(
            req.body
        );
        if (skillSurvey) {
            res.status(201).json({
                success: true,
                message: "Skill survey created successfully",
                data: skillSurvey,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create skill survey",
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
        query("user").optional().isMongoId().withMessage("Invalid User ID format"),
        query("skills").optional().isArray().withMessage("Skills must be an array"),
        query("interests").optional().isArray().withMessage("Interests must be an array"),
        query("helpCategories").optional().isArray().withMessage("Help categories must be an array"),
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
        const skillSurveys = await skillSurveyService.readSkillSurveys(filter);
        res.status(200).json({
            success: true,
            message: "Skill surveys retrieved successfully",
            data: skillSurveys,
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
        const skillSurveys = await skillSurveyService.readSkillSurveys({
            _id: req.params.id,
        });
        if (skillSurveys && skillSurveys.length > 0) {
            res.status(200).json({
                success: true,
                message: "Skill survey retrieved successfully",
                data: skillSurveys,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Skill survey not found",
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
        body('user').notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID format"),
        body('skills').isArray().withMessage("Skills is not an array"),
        body('interests').isArray().withMessage("Interests is not an array"),
        body('helpCategories').isArray().withMessage("Help categories is not an array"),
        body('availabilityHours').optional().isInt({ min: 0 }).withMessage("Availability hours is not valid"),
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
        const skillSurvey = await skillSurveyService.updateSkillSurvey(
            { _id: req.params.id },
            req.body
        );
        if (skillSurvey) {
            res.status(200).json({
                success: true,
                message: "Skill survey updated successfully",
                data: skillSurvey,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Skill survey not found",
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
        await skillSurveyService.deleteSkillSurvey({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Skill survey deleted successfully",
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
