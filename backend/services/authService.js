//Todo:
// make change in the user model,  we are only going to use one token
// Make the one token changes here too

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const tokenSecret = "some_random_text(verrry random)🫦🫦";

async function registerUser(email, password, name, role = ["volunteer"]) {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already in Use");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, name, role });
        await user.save();
        return sanitizeUser(user);
    } catch (error) {
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User Not Found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid Credentials");

        const token = generateToken(user, tokenSecret);

        user.refreshTokens = user.refreshTokens.concat({ token });
        await user.save();

        return {
            user: sanitizeUser(user),
            token,
        };
    } catch (error) {
        throw error;
    }
}

async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, tokenSecret);
        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokens.some((t) => t.token === token)) {
            throw new Error("Invalid token");
        }

        return sanitizeUser(user);
    } catch (error) {
        throw error;
    }
}

async function logoutUser(userId, token) {
    try {
        const user = await User.findById(userId);
        user.refreshTokens = user.refreshTokens.filter(
            (t) => t.token !== token
        );
        await user.save();
    } catch (error) {
        throw error;
    }
}

function generateToken(user, secret) {
    return jwt.sign({ userId: user._id, role: user.role }, secret);
}

function sanitizeUser(user) {
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    logoutUser,
};
