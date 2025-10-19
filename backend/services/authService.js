const User = require("../models/user");
const NGO = require("../models/ngo");
const mongoose = require("mongoose");
const UserNgoRelation = require("../models/userNgoRelation");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("./mailService");
const tokenSecret = "some_random_text(verrry random)";

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

            const ngoExists = await NGO.findById(ngoId);
            if (!ngoExists) {
                throw new Error("Selected NGO does not exist");
            }
        }

        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            const actualAge =
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
                    ? age - 1
                    : age;

            if (actualAge < 16) {
                throw new Error(
                    "User must be at least 16 years old to register"
                );
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

        try {
            const rawToken = user.issueEmailVerificationToken(30);
            await user.save();

            const baseUrl = process.env.APP_BASE_URL || "http://localhost:3001";
            const verifyUrl = `${baseUrl}/api/auth/verify-email?uid=${user._id}&token=${rawToken}`;

            await sendVerificationEmail({
                to: user.email,
                displayName: user.userName,
                verifyUrl,
            });

            console.log(`✅ Verification email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
        }

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

        // Validate age - user must be at least 16 years old.
        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            const actualAge =
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
                    ? age - 1
                    : age;

            if (actualAge < 16) {
                throw new Error(
                    "User must be at least 16 years old to register"
                );
            }
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
            isVerified: false,
            isActive: true,
        });
        await ngo.save();

        const token = generateToken(user);
        user.token = token;
        await user.save();

        // Send verification email
        try {
            const rawToken = user.issueEmailVerificationToken(30); // 30 minutes
            await user.save();

            const baseUrl = process.env.APP_BASE_URL || "http://localhost:3001";
            const verifyUrl = `${baseUrl}/api/auth/verify-email?uid=${user._id}&token=${rawToken}`;

            await sendVerificationEmail({
                to: user.email,
                displayName: user.userName,
                verifyUrl,
            });

            console.log(`✅ Verification email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Don't fail registration if email fails
        }

        return {
            user: sanitizeUser(user),
            ngo: ngo,
            token,
        };
    } catch (error) {
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

        // Check email verification - ENFORCED
        if (!user.emailVerified) {
            throw new Error(
                "Please verify your email before logging in. Check your inbox for the verification link."
            );
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

        const userNgoRelation = await UserNgoRelation.findOne({
            user: user._id,
            isActive: true,
        }).populate({
            path: "ngo",
            populate: {
                path: "category",
            },
        });

        if (userNgoRelation) {
            responseData.associatedNgo = userNgoRelation.ngo;
            responseData.ngoRelationship = {
                relationshipType: userNgoRelation.relationshipType,
                permissions: userNgoRelation.permissions,
                joinedAt: userNgoRelation.joinedAt,
            };
            responseData.ngoId = userNgoRelation.ngo._id;
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

        // Check if user is an NGO owner
        if (user.role.includes("ngo")) {
            const ngo = await NGO.findOne({ user: userId }).populate(
                "category"
            );
            profile.ngo = ngo;
        }

        // Check if user is associated with any NGO (member, volunteer, donor, admin)
        const userNgoRelation = await UserNgoRelation.findOne({
            user: userId,
            isActive: true,
        }).populate({
            path: "ngo",
            populate: {
                path: "category",
            },
        });

        if (userNgoRelation) {
            profile.associatedNgo = userNgoRelation.ngo;
            profile.ngoRelationship = {
                relationshipType: userNgoRelation.relationshipType,
                permissions: userNgoRelation.permissions,
                joinedAt: userNgoRelation.joinedAt,
            };
            // Also store ngoId for easy access
            profile.ngoId = userNgoRelation.ngo._id;
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
