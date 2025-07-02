const express = require("express");
const router = express.Router();
const taskService = require("../services/taskService");

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
