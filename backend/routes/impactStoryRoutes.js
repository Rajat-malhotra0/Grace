const express = require("express");
const router = express.Router();
const impactStoryService = require("../services/impactStoryService");

router.post("/", async (req, res) => {
    try {
        const impactStory = await impactStoryService.createImpactStory(
            req.body
        );
        if (impactStory) {
            res.status(201).json({
                success: true,
                message: "Impact story created successfully",
                data: impactStory,
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
});

router.get("/", async (req, res) => {
    try {
        const filter = req.query;
        const impactStories = await impactStoryService.readImpactStories(
            filter
        );
        res.status(200).json({
            success: true,
            message: "Impact stories retrieved successfully",
            data: impactStories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const impactStories = await impactStoryService.readImpactStories({
            _id: req.params.id,
        });
        if (impactStories && impactStories.length > 0) {
            res.status(200).json({
                success: true,
                message: "Impact story retrieved successfully",
                data: impactStories[0],
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
});

router.put("/:id", async (req, res) => {
    try {
        const impactStory = await impactStoryService.updateImpactStory(
            { _id: req.params.id },
            req.body
        );
        if (impactStory) {
            res.status(200).json({
                success: true,
                message: "Impact story updated successfully",
                data: impactStory,
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
});

router.delete("/:id", async (req, res) => {
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
});

module.exports = router;
