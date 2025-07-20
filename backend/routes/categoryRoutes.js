const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const categoryService = require("../services/categoryService");

router.post(
    "/",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("type")
            .isIn(["task", "ngo", "interest"])
            .withMessage("Type must be one of: task, ngo, interest"),
        body("description").optional().trim(),
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
            const category = await categoryService.createCategory(req.body);
            if (category) {
                return res.status(201).json({
                    success: true,
                    message: "Category created successfully",
                    result: category,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create category",
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
        query("type")
            .optional()
            .isIn(["task", "ngo", "interest"])
            .withMessage("Type must be one of: task, ngo, interest"),
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
            const categories = await categoryService.readCategories(filter);
            return res.status(200).json({
                success: true,
                message: "Categories retrieved successfully",
                result: categories,
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
    [param("id").notEmpty().isMongoId().withMessage("Invalid ID format")],
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
            const categories = await categoryService.readCategories({
                _id: req.params.id,
            });
            if (categories && categories.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Category retrieved successfully",
                    result: categories[0],
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
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
        param("id").notEmpty().isMongoId().withMessage("Invalid ID format"),
        body("name").optional().trim(),
        body("type")
            .optional()
            .isIn(["task", "ngo", "interest"])
            .withMessage("Type must be one of: task, ngo, interest"),
        body("description").optional().trim(),
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
            const category = await categoryService.updateCategory(
                { _id: req.params.id },
                req.body
            );
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: "Category updated successfully",
                    result: category,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
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
    [param("id").notEmpty().isMongoId().withMessage("Invalid ID format")],
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
            await categoryService.deleteCategory({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "Category deleted successfully",
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
