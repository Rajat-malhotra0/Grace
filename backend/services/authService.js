//Todo:
//Cleanup user if NGO creation fails

const User = require("../models/user");
const NGO = require("../models/ngo");
const mongoose = require("mongoose");
const UserNgoRelation = require("../models/userNgoRelation");
const jwt = require("jsonwebtoken");
const tokenSecret = "some_random_text(verrry random)🫦🫦";

async function registerUser(userData) {
    try {
        const {
            userName,
            email,
            password,
            role,
            volunteerType,
            organization,
            location,
            dob,
            ngoId,
            remindMe,
            termsAccepted,
            newsLetter,
        } = userData;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new Error("Email already in use");
            }
        }

        if (role === "ngoMember" && ngoId) {
            if (!mongoose.Types.ObjectId.isValid(ngoId)) {
                throw new Error("Invalid NGO ID format");
            }

            // Check if NGO exists
            const ngoExists = await NGO.findById(ngoId);
            if (!ngoExists) {
                throw new Error("Selected NGO does not exist");
            }
        }

        const user = new User({
            userName,
            email,
            password,
            role: role ? [role] : ["volunteer"],
            volunteerType,
            organization,
            location,
            dob: dob ? new Date(dob) : null,
            remindMe: remindMe || false,
            termsAccepted: termsAccepted || false,
            newsLetter: newsLetter || false,
            isActive: true,
        });

        await user.save();

        if (role === "ngoMember" && ngoId) {
            try {
                await UserNgoRelation.create({
                    user: user._id,
                    ngo: ngoId,
                    relationshipType: ["member"],
                    permissions: [],
                });
            } catch (error) {
                console.log("failed to make realtion " + error);
            }
        }

        const token = generateToken(user);
        user.token = token;
        await user.save();

        return {
            user: sanitizeUser(user),
            token,
        };
    } catch (error) {
        throw error;
    }
}

async function registerNGO(userData) {
    let user;
    try {
        const {
            userName,
            email,
            password,
            organizationName,
            registrationNumber,
            description,
            category,
            address,
            phoneNumber,
            website,
            dob,
            remindMe,
            termsAccepted,
            newsLetter,
        } = userData;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("Email or Username already in use");
        }

        const user = new User({
            userName,
            email,
            password,
            role: ["ngo"],
            dob: dob ? new Date(dob) : null,
            remindMe: remindMe || false,
            termsAccepted: termsAccepted || false,
            newsLetter: newsLetter || false,
            isActive: true,
        });
        await user.save();

        const ngo = new NGO({
            user: user._id,
            name: organizationName,
            registerationId: registrationNumber,
            description,
            category,
            location: {
                address: address || "",
            },
            contact: {
                email,
                phone: phoneNumber || "",
                website: website || "",
            },
            isActive: true,
        });
        await ngo.save();

        const token = generateToken(user);
        user.token = token;
        await user.save();

        return {
            user: sanitizeUser(user),
            ngo: ngo,
            token,
        };
    } catch (error) {
        // Cleanup user if NGO creation fails
        if (user && user._id) {
            await User.findByIdAndDelete(user._id);
        }
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken(user);
        user.token = token;
        await user.save();

        let responseData = {
            user: sanitizeUser(user),
            token,
        };

        if (user.role.includes("ngo")) {
            const ngo = await NGO.findOne({ user: user._id }).populate(
                "category"
            );
            responseData.ngo = ngo;
        }

        return responseData;
    } catch (error) {
        throw error;
    }
}

async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, tokenSecret);
        const user = await User.findById(decoded.userId);

        if (!user || user.token !== token || !user.isActive) {
            throw new Error("Invalid token");
        }

        return sanitizeUser(user);
    } catch (error) {
        throw error;
    }
}

async function logoutUser(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.token = null;
        await user.save();

        return { message: "Logged out successfully" };
    } catch (error) {
        throw error;
    }
}

async function getUserProfile(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        let profile = { user: sanitizeUser(user) };

        if (user.role.includes("ngo")) {
            const ngo = await NGO.findOne({ user: userId }).populate(
                "category"
            );
            profile.ngo = ngo;
        }

        return profile;
    } catch (error) {
        throw error;
    }
}

function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
            email: user.email,
        },
        tokenSecret
    );
}

function sanitizeUser(user) {
    return {
        //Clean up this dual id thing later
        _id: user._id,
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        about: user.about,
        score: user.score,
        dob: user.dob,
        remindMe: user.remindMe,
        termsAccepted: user.termsAccepted,
        newsLetter: user.newsLetter,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
}

module.exports = {
    registerUser,
    registerNGO,
    loginUser,
    verifyToken,
    logoutUser,
    getUserProfile,
    generateToken,
    sanitizeUser,
};
