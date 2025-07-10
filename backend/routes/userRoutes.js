const express = require("express");
const router = express.Router();
const { body, query, validationResult  } = require("express-validator");
const userService = require("../services/userService");

router.post("/",
    [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
    body("email").trim().isEmail().withMessage("email is required"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password must be atleast 6 characters Long"),
    body("role").isIn(['volunteer','donor','admin']).withMessage("Role must be one of: volunteer, donor, admin"),
    body("about").optional().trim()
    ],
    async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            errors: errors.array()
        });
    }
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

router.get("/",
    [
        query("name").optional().trim(),
        query("email").optional().isEmail().withMessage("Invalid email format"),
        query("role").optional().isIn(['volunteer', 'donor', 'admin']).withMessage("Role must be one of: volunteer, donor, admin"),
        query("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
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

router.get("/:id",
    [
        query("id").notEmpty().withMessage("ID is required")
    ], async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: error.array(),
            });
        }
        res.send(`User ID: ${req.params.id}`);
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

router.put("/:id",
    [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
    body("email").trim().isEmail().withMessage("email is required"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password must be atleast 6 characters Long"),
    body("role").isIn(['volunteer','donor','admin']).withMessage("Role must be one of: volunteer, donor, admin"),
    body("about").optional().trim(),
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

router.delete("/:id",
    [
        param("id").notEmpty().withMessage("ID is required"),
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
