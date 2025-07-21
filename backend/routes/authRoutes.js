const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authService = require("../services/authService");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post(
    "/register",
    [
        body("userName").trim().notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("termsAccepted")
            .equals("true")
            .withMessage("Terms must be accepted"),
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
            const result = await authService.registerUser(req.body);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                result: result,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

router.post(
    "/register-ngo",
    [
        body("userName").trim().notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("organizationName")
            .trim()
            .notEmpty()
            .withMessage("Organization name is required"),
        body("category").isMongoId().withMessage("Valid category is required"),
        body("termsAccepted")
            .equals("true")
            .withMessage("Terms must be accepted"),
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
            const result = await authService.registerNGO(req.body);
            return res.status(201).json({
                success: true,
                message: "NGO registered successfully",
                result: result,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
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
            const { email, password } = req.body;
            const result = await authService.loginUser(email, password);

            return res.json({
                success: true,
                message: "Login successful",
                result: result,
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }
);

router.post("/logout", authMiddleware, async (req, res) => {
    try {
        await authService.logoutUser(req.user.id);
        return res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const profile = await authService.getUserProfile(req.user.id);
        return res.json({
            success: true,
            result: profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
