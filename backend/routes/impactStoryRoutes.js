const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const impactStoryService = require("../services/impactStoryService");

router.post(
    "/",
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("createdBy")
            .notEmpty()
            .withMessage("Created by is required")
            .isMongoId()
            .withMessage("Invalid user ID format"),
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
            const impactStory = await impactStoryService.createImpactStory(
                req.body
            );
            if (impactStory) {
                res.status(201).json({
                    success: true,
                    message: "Impact story created successfully",
                    result: impactStory,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Failed to create impact story",
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
        query("title").optional().trim(),
        query("relatedTask")
            .optional()
            .isMongoId()
            .withMessage("Invalid task ID format"),
        query("createdBy")
            .optional()
            .isMongoId()
            .withMessage("Invalid user ID format"),
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
            const impactStories = await impactStoryService.readImpactStories(
                filter
            );
            res.status(200).json({
                success: true,
                message: "Impact stories retrieved successfully",
                result: impactStories,
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
            const impactStories = await impactStoryService.readImpactStories({
                _id: req.params.id,
            });
            if (impactStories && impactStories.length > 0) {
                res.status(200).json({
                    success: true,
                    message: "Impact story retrieved successfully",
                    result: impactStories[0],
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Impact story not found",
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
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("content").trim().notEmpty().withMessage("Content is required"),
        body("createdBy")
            .notEmpty()
            .withMessage("Created by is required")
            .isMongoId()
            .withMessage("Invalid user ID format"),
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
            const impactStory = await impactStoryService.updateImpactStory(
                { _id: req.params.id },
                req.body
            );
            if (impactStory) {
                res.status(200).json({
                    success: true,
                    message: "Impact story updated successfully",
                    result: impactStory,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Impact story not found",
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
            await impactStoryService.deleteImpactStory({ _id: req.params.id });
            res.status(200).json({
                success: true,
                message: "Impact story deleted successfully",
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
