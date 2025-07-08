const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req,res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password -refreshToken');

        if (!user) return res.sendStatus(401);

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication Error : ',err.message);
        res.sendStatus(403);
    }
};

const roleMiddleware = (roles) => {
    return (req,res,next) => {
        if (!roles.includes(req.user.role)){
            return res.status(403).json({message : 'Forbidden'});
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };