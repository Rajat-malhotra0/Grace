const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");
const {
    authMiddleware,
    roleMiddleware,
} = require("../middleware/authMiddleware");
const ngoService = require("../services/ngoService");
const userService = require("../services/userService");

// Middleware to ensure only admins can access these routes
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// Get pending NGOs for verification
router.get("/ngos/pending", async (req, res) => {
    try {
        console.log("Admin requesting pending NGOs...");
        const pendingNgos = await ngoService.getPendingNgos();
        console.log(`Found ${pendingNgos.length} pending NGOs`);
        return res.status(200).json({
            success: true,
            message: "Pending NGOs retrieved successfully",
            result: pendingNgos,
        });
    } catch (error) {
        console.error("Error fetching pending NGOs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

// Approve or reject NGO verification
router.patch(
    "/ngos/:id/verify",
    [
        param("id")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID format"),
        body("isApproved")
            .notEmpty()
            .withMessage("Approval status is required")
            .isBoolean()
            .withMessage("Approval status must be a boolean"),
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
            const { id } = req.params;
            const { isApproved } = req.body;

            const ngo = await ngoService.verifyNgo(id, isApproved);

            const statusMessage = isApproved ? "approved" : "rejected";

            return res.status(200).json({
                success: true,
                message: `NGO ${statusMessage} successfully`,
                result: ngo,
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

// Get admin dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const ngoStats = await ngoService.getNgoStats();
        const totalUsers = await userService.readUsers({ isActive: true });

        const stats = {
            ngos: ngoStats,
            totalUsers: totalUsers.length,
            usersByRole: {
                volunteers: totalUsers.filter((user) =>
                    user.role.includes("volunteer")
                ).length,
                donors: totalUsers.filter((user) => user.role.includes("donor"))
                    .length,
                ngoMembers: totalUsers.filter((user) =>
                    user.role.includes("ngoMember")
                ).length,
                ngos: totalUsers.filter((user) => user.role.includes("ngo"))
                    .length,
            },
        };

        return res.status(200).json({
            success: true,
            message: "Admin statistics retrieved successfully",
            result: stats,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
