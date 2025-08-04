const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const chatBotService = require("../services/chatBotService");
const Article = require("../models/article");

// GET /api/articles - Get all articles
router.get("/", async (req, res) => {
    try {
        const { category, isActive, search } = req.query;
        let filter = {};
        if (category) {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }
        let query = Article.find(filter);
        if (search) {
            query = Article.find({
                ...filter,
                $text: { $search: search }
            });
        }
        const articles = await query
            .sort({ createdAt: -1 })
            .populate("createdBy", "userName email")
            .populate("updatedBy", "userName email");
        res.json({
            success: true,
            data: articles,
            count: articles.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching articles",
            error: error.message,
        });
    }
});

// GET /api/articles/:id - Get single article
router.get("/:id", [
    param("id").isMongoId().withMessage("Invalid article ID"),
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
        const article = await Article.findById(req.params.id)
            .populate("createdBy", "userName email")
            .populate("updatedBy", "userName email");
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        res.json({
            success: true,
            data: article,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching article",
            error: error.message,
        });
    }
});

// POST /api/articles - Create new article
router.post("/",
    [
    body("title").notEmpty().withMessage("Title is required").trim(),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").isIn(["tasks", "navigation", "ngo", "analytics", "general", "donations", "users"]).withMessage("Invalid category"),
    body("source").optional().trim(),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
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
        const articleData = {
            ...req.body,
            createdBy: req.user.id,
        };
        const article = new Article(articleData);
        await article.save();
        // Add to vector store
        await chatBotService.addNewArticleToVectorStore(article._id);
        const populatedArticle = await Article.findById(article._id).populate("createdBy", "userName email");
        res.status(201).json({
            success: true,
            message: "Article created successfully",
            data: populatedArticle,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating article",
            error: error.message,
        });
    }
});

// PUT /api/articles/:id - Update article
router.put("/:id", [
    param("id").isMongoId().withMessage("Invalid article ID"),
    body("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
    body("content").optional().notEmpty().withMessage("Content cannot be empty"),
    body("category").optional().isIn(["tasks", "navigation", "ngo", "analytics", "general", "donations", "users"]).withMessage("Invalid category"),
    body("source").optional().trim(),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
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
        const updateData = {
            ...req.body,
            updatedBy: req.user.id,
        };
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate("createdBy updatedBy", "userName email");
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        // Refresh knowledge base to update vector store
        await chatBotService.refreshKnowledgeBase();
        res.json({
            success: true,
            message: "Article updated successfully",
            data: article,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating article",
            error: error.message,
        });
    }
});

// DELETE /api/articles/:id - Delete article
router.delete("/:id",
    [
    param("id").isMongoId().withMessage("Invalid article ID"),
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
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        // Refresh knowledge base to remove from vector store
        await chatBotService.refreshKnowledgeBase();
        res.json({
            success: true,
            message: "Article deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting article",
            error: error.message,
        });
    }
});

// POST /api/articles/refresh-knowledge-base - Refresh chatbot knowledge base
router.post("/refresh-knowledge-base",  async (req, res) => {
    try {
        const success = await chatBotService.refreshKnowledgeBase();
        if (success) {
            res.json({
                success: true,
                message: "Knowledge base refreshed successfully",
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to refresh knowledge base",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error refreshing knowledge base",
            error: error.message,
        });
    }
});

module.exports = router;
