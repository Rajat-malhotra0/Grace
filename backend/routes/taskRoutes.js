const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const taskService = require("../services/taskService");

router.post(
    "/",
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("category")
            .notEmpty()
            .isMongoId()
            .withMessage("Category ID is required"),
        body("ngo").notEmpty().isMongoId().withMessage("NGO ID is required "),
        body("createdBy")
            .notEmpty()
            .isMongoId()
            .withMessage(
                "CreatedBy ID is required and must be a valid MongoDB ObjectId"
            ),
        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid user ID"),
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
            const task = await taskService.createTask(req.body);
            if (task) {
                return res.status(201).json({
                    success: true,
                    message: "Task created successfully",
                    result: task,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create task",
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
        query("status")
            .optional()
            .isIn(["free", "in-progress", "done", "cancelled"])
            .withMessage(
                "Status must be one of: free, in-progress, done, cancelled"
            ),
        query("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid user ID"),
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
            const tasks = await taskService.readTasks(filter);
            return res.status(200).json({
                success: true,
                message: "Tasks retrieved successfully",
                result: tasks,
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
    "/ngo/:ngoId",
    [
        param("ngoId")
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
            const tasks = await taskService.readTasks({
                ngo: req.params.ngoId,
            });
            return res.status(200).json({
                success: true,
                message: "Tasks retrieved successfully",
                result: tasks,
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

// Add route for getting tasks by user ID (assignedTo)
router.get(
    "/user/:userId",
    [
        param("userId")
            .notEmpty()
            .withMessage("User ID is required")
            .isMongoId()
            .withMessage("Invalid User ID format"),
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
            const tasks = await taskService.readTasks({
                assignedTo: req.params.userId,
            });
            return res.status(200).json({
                success: true,
                message: "User tasks retrieved successfully",
                result: tasks,
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
            const tasks = await taskService.readTasks({ _id: req.params.id });
            if (tasks && tasks.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Task retrieved successfully",
                    result: tasks,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Task not found",
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
        body("status")
            .optional()
            .isIn(["free", "in-progress", "done", "cancelled"])
            .withMessage(
                "Status must be one of: free, in-progress, done, cancelled"
            ),
        body("priority")
            .optional()
            .isIn(["low", "medium", "high"])
            .withMessage("Priority must be one of: low, medium, high"),
        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid user ID"),
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
            const task = await taskService.updateTask(
                { _id: req.params.id },
                req.body
            );
            if (task) {
                return res.status(200).json(task); // Direct task response to match frontend expectations
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Task not found",
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
            await taskService.deleteTask({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "Task deleted successfully",
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
