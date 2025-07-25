const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const SkillSurvey = require("../models/skillSurvey");
const Category = require("../models/category");
const { authMiddleware } = require("../middleware/authMiddleware");
const { set } = require("mongoose");

router.post(
    "/submit",
    authMiddleware,
    [
        body("answers").isArray().withMessage("Answers must be an array"),
        body("aggregatedData")
            .isObject()
            .withMessage("Aggregated data must be an object"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { answers, aggregatedData } = req.body;
            const userId = req.user.id;

            let interestIds = [];
            if (
                aggregatedData.interests &&
                aggregatedData.interests.length > 0
            ) {
                const categories = await Category.find({
                    name: { $in: aggregatedData.interests },
                    type: "interest",
                });
                interestIds = categories.map((cat) => cat._id);

                for (const interestName of aggregatedData.interests) {
                    const existingCategory = categories.find(
                        (cat) => cat.name === interestName
                    );
                    if (!existingCategory) {
                        const newCategory = new Category({
                            name: interestName,
                            type: "interest",
                            description: `Interest category created from quiz: ${interestName}`,
                        });
                        const savedCategory = await newCategory.save();
                        interestIds.push(savedCategory._id);
                    }
                }
            }


            const surveyData = {
                user: userId,
                answers: answers,
                skills: aggregatedData.skills || [],
                interests: interestIds,
                availabilityHours: aggregatedData.availabilityHours || 0,
                commitmentLevel: aggregatedData.commitmentLevel || "",
                volunteerType: aggregatedData.volunteerType || "",
                travelWillingness: aggregatedData.travelWillingness || "",
                motivation: aggregatedData.motivation || [],
                workStyle: aggregatedData.workStyle || [],
                intent: aggregatedData.intent || "",
                updatedAt: new Date(),
            };


            let skillSurvey = await SkillSurvey.findOne({ user: userId });

            if (skillSurvey) {
                skillSurvey.set(surveyData);
                await skillSurvey.save();
            } else {
                skillSurvey = new SkillSurvey(surveyData);
                await skillSurvey.save();
            }

            res.status(200).json({
                success: true,
                message: "Quiz results saved successfully",
                surveyId: skillSurvey._id,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to save quiz results",
                error: error.message,
            });
        }
    }
);

module.exports = router;
