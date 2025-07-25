const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authService = require("../services/authService");

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
        res.status(403).json({
            success: false,
            message: "Invalid token",
            error: error.message,
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
