const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const userService = require("../services/userService");

router.post(
    "/",
    [
        body("userName")
            .trim()
            .notEmpty()
            .withMessage("userName is required")
            .isLength({ min: 3 })
            .withMessage("Name must be at least 3 characters long"),
        body("email").trim().isEmail().withMessage("email is required"),
        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password must be atleast 6 characters Long"),
        body("role")
            .isIn(["volunteer", "donor", "admin"])
            .withMessage("Role must be one of: volunteer, donor, admin"),
        body("about").optional().trim(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }
        try {
            const user = await userService.createUser(req.body);
            if (user) {
                return res.status(201).json({
                    success: true,
                    message: "User created successfully",
                    result: user,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create user",
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
        query("userName").optional().trim(),
        query("email").optional().isEmail().withMessage("Invalid email format"),
        query("role")
            .optional()
            .isIn(["volunteer", "donor", "admin"])
            .withMessage("Role must be one of: volunteer, donor, admin"),
        query("isActive")
            .optional()
            .isBoolean()
            .withMessage("isActive must be a boolean"),
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
            const users = await userService.readUsers(filter);
            return res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                result: users,
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
            // Get users who are associated with this NGO (volunteers/employees)
            const users = await userService.getUsersByNgo(req.params.ngoId);
            return res.status(200).json({
                success: true,
                message: "NGO users retrieved successfully",
                result: users,
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

router.get("/leaderboard", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const leaderboard = await userService.getLeaderboard(limit);

        return res.status(200).json({
            success: true,
            message: "Leaderboard retrieved successfully",
            result: leaderboard,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/complete-task/:taskId", async (req, res) => {
    try {
        const userId = req.body.userId;
        const hoursSpent = req.body.hours || 1;
        const taskId = req.params.taskId;

        const result = await userService.completeTask(
            taskId,
            userId,
            hoursSpent
        );

        return res.status(200).json({
            success: true,
            message: "Task completed successfully",
            result: {
                pointsEarned: result.pointsEarned,
                hours: result.user.leaderboardStats.hours,
                activities: result.user.leaderboardStats.tasksCompleted,
                impact: result.user.leaderboardStats.impactScore,
                streak: result.user.leaderboardStats.currentStreak,
                level: result.user.leaderboardStats.level,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await userService.readUsers({ email });
        const user = Array.isArray(users) ? users[0] : users;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login Sucessfull",
            result: user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
});

router.get(
    "/:id",
    [
        param("id")
            .notEmpty()
            .withMessage("ID is required")
            .isMongoId()
            .withMessage("Invalid ID"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: error.array(),
            });
        }
        try {
            const users = await userService.readUsers({ _id: req.params.id });
            if (users && users.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "User retrieved successfully",
                    result: users[0],
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
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
        body("userName")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 3 })
            .withMessage("Name must be at least 3 characters long"),
        body("email").trim().isEmail().withMessage("email is required"),
        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password must be atleast 6 characters Long"),
        body("role")
            .isIn(["volunteer", "donor", "admin"])
            .withMessage("Role must be one of: volunteer, donor, admin"),
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
                return res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    result: user,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
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
    [param("id").notEmpty().withMessage("ID is required")],
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
            await userService.deleteUser({ _id: req.params.id });
            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
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
