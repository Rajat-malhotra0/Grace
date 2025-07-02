const express = require("express");
const router = express.Router();
const skillSurveyService = require("../services/skillSurveyService");

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
