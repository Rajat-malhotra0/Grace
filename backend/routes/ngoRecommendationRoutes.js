const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SkillSurvey = require("../models/skillSurvey");
const NGO = require("../models/ngo");
const { authMiddleware } = require("../middleware/authMiddleware");

//Divide it into it's own service or integrate with skillSurvey thing
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        const skillSurvey = await SkillSurvey.findOne({
            user: userId,
        }).populate("interests", "name");

        if (!skillSurvey) {
            return res.status(404).json({
                success: false,
                message: "No quiz data found. Please take the quiz first.",
            });
        }

        const ngos = await NGO.find({
            isActive: true,
        })
            .populate("category", "name")
            .populate(
                "user",
                "userName email location organizationName website phoneNumber registrationNumber"
            )
            .select("name description category contact user isVerified");

        const userInterestNames = skillSurvey.interests.map((interest) =>
            interest.name.toLowerCase()
        );
        const userSkills = skillSurvey.skills.map((skill) =>
            skill.toLowerCase()
        );

        const matchedNGOs = ngos.filter((ngo) => {
            const ngoCategories = ngo.category
                ? ngo.category.map((cat) => cat.name.toLowerCase())
                : [];
            const ngoDescription = (ngo.description || "").toLowerCase();

            const hasInterestMatch = userInterestNames.some((interest) =>
                ngoCategories.some(
                    (category) =>
                        category.includes(interest) ||
                        interest.includes(category)
                )
            );

            const hasSkillMatch = userSkills.some(
                (skill) =>
                    ngoDescription.includes(skill) ||
                    ngoCategories.some((category) => category.includes(skill))
            );

            return hasInterestMatch || hasSkillMatch;
        });

        const recommendations = matchedNGOs.map((ngo) => ({
            _id: ngo._id,
            organizationName: ngo.user?.organizationName || ngo.name,
            description: ngo.description,
            category: ngo.category || [],
            website: ngo.contact?.website || ngo.user?.website,
            user: ngo.user,
            isVerified: ngo.isVerified,
        }));

        res.status(200).json({
            success: true,
            recommendations,
            totalMatches: recommendations.length,
        });
    } catch (error) {
        console.error("Error generating NGO recommendations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate recommendations",
            error: error.message,
        });
    }
});

module.exports = router;
