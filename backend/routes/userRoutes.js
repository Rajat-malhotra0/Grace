const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.post("/", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        if (user) {
            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create user",
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
        const users = await userService.readUsers(filter);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
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
        const users = await userService.readUsers({ _id: req.params.id });
        if (users && users.length > 0) {
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: users[0],
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
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
        const user = await userService.updateUser(
            { _id: req.params.id },
            req.body
        );
        if (user) {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
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
        await userService.deleteUser({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
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
