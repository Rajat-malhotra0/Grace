const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenSecret = "some_random_text(verrry random)🫦🫦";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required",
            });
        }

        const user = await authService.verifyToken(token);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(403).json({
            success: false,
            message: "Invalid token",
        });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user.role.some((role) => roles.includes(role))) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions",
            });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
