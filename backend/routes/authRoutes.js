const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const router = express.Router();
const authService = require("../services/authService");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/user");
const { sendVerificationEmail } = require("../services/mailService");

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
        body("category")
            .isArray({ min: 1 })
            .withMessage("At least one category is required")
            .custom((categories) => {
                // Check if all items in array are valid MongoIds
                for (let category of categories) {
                    if (!mongoose.Types.ObjectId.isValid(category)) {
                        throw new Error("All categories must be valid IDs");
                    }
                }
                return true;
            }),
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
                error: error,
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

router.get("/verify-email", async (req, res) => {
    try {
        const { uid, token } = req.query;

        if (!uid || !token) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification link",
            });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.emailVerified) {
            const frontendUrl =
                process.env.FRONTEND_BASE_URL || "http://localhost:5173";
            return res.redirect(`${frontendUrl}/verify-success?status=already`);
        }

        if (!user.verifyEmailToken(token)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token",
            });
        }

        user.markEmailVerified();
        await user.save();

        const frontendUrl =
            process.env.FRONTEND_BASE_URL || "http://localhost:5173";
        return res.redirect(`${frontendUrl}/verify-success`);
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Verification failed",
        });
    }
});

router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.emailVerified) {
            return res.status(200).json({
                success: true,
                message: "Email already verified",
            });
        }

        const rawToken = user.issueEmailVerificationToken(30);
        await user.save();

        const baseUrl = process.env.APP_BASE_URL || "http://localhost:3001";
        const verifyUrl = `${baseUrl}/api/auth/verify-email?uid=${user._id}&token=${rawToken}`;

        await sendVerificationEmail({
            to: user.email,
            displayName: user.userName,
            verifyUrl,
        });

        return res.status(200).json({
            success: true,
            message: "Verification email sent",
        });
    } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send verification email",
        });
    }
});

module.exports = router;
