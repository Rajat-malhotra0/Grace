const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const chatBotService = require("../services/chatBotService");

router.post(
    "/chat",
    [
        body("message")
            .notEmpty()
            .withMessage("Message is required")
            .isString()
            .withMessage("Message must be a string")
            .isLength({ max: 500 }),
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
            const { message } = req.body;
            if (message.length > 500) {
                return res
                    .status(400)
                    .json({
                        error: "Message too long. Please keep it under 500 characters.",
                    });
            }

            const result = await chatBotService.getChatbotResponse(
                message.trim()
            );

            const responseData = {
                response: result.answer,
                sources: result.sources || ["AI Assistant"],
                relevantDocs: result.foundDocs,
                timestamp: new Date().toISOString(),
            };

            res.json(responseData);
        } catch (error) {
            res.status(500).json({
                error: "Internal server error. Please try again later.",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

router.post(
    "/init",
    [
        body("force")
            .optional()
            .isBoolean()
            .withMessage("Force must be a boolean value"),
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
            await chatBotService.setupKnowledgeBase();
            res.json({
                success: true,
                message: "Knowledge base initialized successfully",
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/add-document",
    [body("content").notEmpty().withMessage("Content is required")],
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
            const { content, metadata } = req.body;
            if (!content) {
                return res.status(400).json({ error: "Content is required" });
            }

            await chatBotService.addArticles([
                { content, metadata: metadata || {} },
            ]);
            res.json({
                success: true,
                message: "Document added successfully",
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get("/health", async (req, res) => {
    try {
        res.json({
            status: "healthy",
            service: "chatbot",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
