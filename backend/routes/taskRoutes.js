const express = require("express");
const router = express.Router();
const { body, query, validationResult } = require("express-validator");
const taskService = require("../services/taskService");

router.post("/",[
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("status").isIn(['pending', 'in-progress', 'completed']).withMessage("Status must be one of: pending, in-progress, completed"),
    body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({
                status: 400,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
        const task = await taskService.createTask(req.body);
        if (task) {
            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: task,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create task",
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
        query("title").optional().trim(),
        query("status").optional().isIn(['pending', 'in-progress', 'completed']).withMessage("Status must be one of: pending, in-progress, completed"),
        query("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({
                status: 400,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
        const filter = req.query;
        const tasks = await taskService.readTasks(filter);
        res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: tasks,
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
        query("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID format"),
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    try {
        const tasks = await taskService.readTasks({ _id: req.params.id });
        if (tasks && tasks.length > 0) {
            res.status(200).json({
                success: true,
                message: "Task retrieved successfully",
                data: tasks,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Task not found",
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
        body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
        body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
        body("status").optional().isIn(['pending', 'in-progress', 'completed']).withMessage("Status must be one of: pending, in-progress, completed"),
        body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
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
            res.status(200).json({
                success: true,
                message: "Task updated successfully",
                data: task,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Task not found",
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
        query("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID format"),
    ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
        try {
        await taskService.deleteTask({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
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
