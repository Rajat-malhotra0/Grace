const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const impactStoryService = require("../services/impactStoryService");

// Route to generate AI description
router.post(
    "/generate-description",
    [body("userInput").trim().notEmpty().withMessage("User input is required")],
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
            const aiResult =
                await impactStoryService.generateAIStoryDescription(
                    req.body.userInput
                );
            return res.status(200).json({
                success: true,
                message: "AI description generated successfully",
                result: aiResult,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate AI description",
                error: error.message,
            });
        }
    }
);

router.post(
    "/",
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("content").trim().notEmpty().withMessage("Content is required"),
        body("category").optional().trim(),
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
                return res.status(201).json({
                    success: true,
                    message: "Impact story created successfully",
                    result: impactStory,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create impact story",
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
            const limit = req.query.limit || 10;
            const sort = req.query.sort || "-createdAt";
            const impactStories = await impactStoryService.readImpactStories(
                filter
            );
            return res.status(200).json({
                success: true,
                message: "Impact stories retrieved successfully",
                result: impactStories,
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

router.get("/latest/:count", async (req, res) => {
    try {
        count = req.params.count;

        const latestStories = await impactStoryService.readLatestImpactStories(
            count
        );

        return res.status(200).json({
            success: true,
            message: `Latest ${latestStories.length} impact stories retrieved successfully.`,
            result: latestStories,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

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
                return res.status(200).json({
                    success: true,
                    message: "Impact story retrieved successfully",
                    result: impactStories[0],
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Impact story not found",
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
                return res.status(200).json({
                    success: true,
                    message: "Impact story updated successfully",
                    result: impactStory,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Impact story not found",
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
            await impactStoryService.deleteImpactStory({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "Impact story deleted successfully",
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
