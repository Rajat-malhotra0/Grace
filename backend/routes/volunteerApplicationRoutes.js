const express = require("express");
const router = express.Router();
const { body, param, query, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/authMiddleware");
const VolunteerApplication = require("../models/volunteerApplication");
const User = require("../models/user");
const NGO = require("../models/ngo");
const UserNgoRelation = require("../models/userNgoRelation");
const { sendEmail } = require("../services/mailService");

// Apply for a volunteer opportunity
router.post(
    "/apply",
    authMiddleware,
    [
        body("ngoId")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID"),
        body("opportunityId")
            .notEmpty()
            .withMessage("Opportunity ID is required")
            .isInt()
            .withMessage("Opportunity ID must be a number"),
        body("message").optional().trim(),
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
            const { ngoId, opportunityId, message } = req.body;
            const userId = req.user.id;

            // Check if NGO exists
            const ngo = await NGO.findById(ngoId);
            if (!ngo) {
                return res.status(404).json({
                    success: false,
                    message: "NGO not found",
                });
            }

            // Find the specific opportunity
            const opportunity = ngo.volunteer.opportunities.find(
                (opp) => opp.id === parseInt(opportunityId)
            );

            if (!opportunity) {
                return res.status(404).json({
                    success: false,
                    message: "Volunteer opportunity not found",
                });
            }

            // Check if user already applied
            const existingApplication = await VolunteerApplication.findOne({
                user: userId,
                ngo: ngoId,
                opportunityId: opportunityId,
            });

            if (existingApplication) {
                return res.status(400).json({
                    success: false,
                    message: "You have already applied for this opportunity",
                    application: existingApplication,
                });
            }

            // Create new application
            const application = new VolunteerApplication({
                user: userId,
                ngo: ngoId,
                opportunityId: opportunityId,
                opportunityTitle: opportunity.title,
                message: message || "",
                status: "pending",
            });

            await application.save();

            // Get user details for email
            const user = await User.findById(userId);

            // Send notification email to NGO
            try {
                await sendEmail({
                    to: ngo.contact.email,
                    subject: `New Volunteer Application - ${opportunity.title}`,
                    html: `
                        <h2>New Volunteer Application</h2>
                        <p>A new volunteer has applied for: <strong>${
                            opportunity.title
                        }</strong></p>
                        <p><strong>Applicant:</strong> ${user.userName}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        ${
                            message
                                ? `<p><strong>Message:</strong> ${message}</p>`
                                : ""
                        }
                        <p>Please log in to your dashboard to review this application.</p>
                    `,
                });
            } catch (emailError) {
                console.error("Failed to send notification email:", emailError);
                // Continue even if email fails
            }

            return res.status(201).json({
                success: true,
                message:
                    "Your volunteer application has been submitted successfully! The NGO will review it and contact you via email.",
                result: application,
            });
        } catch (error) {
            console.error("Apply for volunteer error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to submit application",
                error: error.message,
            });
        }
    }
);

// Get user's applications
router.get("/my-applications", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.query.status;

        const filter = { user: userId };
        if (status) {
            filter.status = status;
        }

        const applications = await VolunteerApplication.find(filter)
            .populate("ngo", "name contact coverImage")
            .sort({ appliedAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            result: applications,
        });
    } catch (error) {
        console.error("Get user applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve applications",
            error: error.message,
        });
    }
});

// Get applications for an NGO (NGO admin only)
router.get(
    "/ngo/:ngoId",
    authMiddleware,
    [
        param("ngoId")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID"),
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
            const { ngoId } = req.params;
            const status = req.query.status;

            console.log("=== Volunteer Applications Request ===");
            console.log("Requested NGO ID:", ngoId);
            console.log("Logged in User ID:", req.user.id);

            // Verify user is associated with the NGO
            const ngo = await NGO.findById(ngoId);
            if (!ngo) {
                return res.status(404).json({
                    success: false,
                    message: "NGO not found",
                });
            }

            console.log("Found NGO:", {
                id: ngo._id,
                name: ngo.name,
                userId: ngo.user,
            });

            console.log("Authorization check:", {
                ngoUserId: ngo.user.toString(),
                requestUserId: req.user.id.toString(),
                match: ngo.user.toString() === req.user.id.toString(),
                ngoUserIdLength: ngo.user.toString().length,
                reqUserIdLength: req.user.id.toString().length,
            });

            if (ngo.user.toString() !== req.user.id.toString()) {
                console.log("❌ AUTHORIZATION FAILED - IDs don't match");
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized: You don't have access to this NGO",
                    debug: {
                        ngoOwnerId: ngo.user.toString(),
                        yourUserId: req.user.id.toString(),
                    },
                });
            }

            console.log("✅ Authorization passed");

            const filter = { ngo: ngoId };
            if (status) {
                filter.status = status;
            }

            const applications = await VolunteerApplication.find(filter)
                .populate("user", "userName email location volunteerType")
                .sort({ appliedAt: -1 });

            return res.status(200).json({
                success: true,
                message: "Applications retrieved successfully",
                result: applications,
            });
        } catch (error) {
            console.error("Get NGO applications error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve applications",
                error: error.message,
            });
        }
    }
);

// Update application status (NGO admin only)
router.patch(
    "/:applicationId/status",
    authMiddleware,
    [
        param("applicationId")
            .notEmpty()
            .withMessage("Application ID is required")
            .isMongoId()
            .withMessage("Invalid application ID"),
        body("status")
            .notEmpty()
            .withMessage("Status is required")
            .isIn(["accepted", "rejected"])
            .withMessage("Status must be either 'accepted' or 'rejected'"),
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
            const { applicationId } = req.params;
            const { status } = req.body;

            // Find the application
            const application = await VolunteerApplication.findById(
                applicationId
            ).populate("user ngo");

            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found",
                });
            }

            // Verify user is the NGO owner
            if (application.ngo.user.toString() !== req.user.id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized: You don't have access to this NGO",
                });
            }

            if (application.status !== "pending") {
                return res.status(400).json({
                    success: false,
                    message: `Application has already been ${application.status}`,
                });
            }

            // Update application status
            application.status = status;
            application.reviewedAt = new Date();
            application.reviewedBy = req.user.id;
            await application.save();

            // If accepted, add user as NGO member
            if (status === "accepted") {
                // Check if relation already exists
                const existingRelation = await UserNgoRelation.findOne({
                    user: application.user._id,
                    ngo: application.ngo._id,
                });

                if (!existingRelation) {
                    // Create new relation
                    const relation = new UserNgoRelation({
                        user: application.user._id,
                        ngo: application.ngo._id,
                        relationshipType: ["volunteer"],
                        permissions: [],
                        isActive: true,
                    });
                    await relation.save();
                } else {
                    // Update existing relation to include volunteer
                    if (
                        !existingRelation.relationshipType.includes("volunteer")
                    ) {
                        existingRelation.relationshipType.push("volunteer");
                        existingRelation.isActive = true;
                        await existingRelation.save();
                    }
                }

                // Update user role to include volunteer and ngoMember if not already present
                const user = await User.findById(application.user._id);
                if (!user.role.includes("volunteer")) {
                    user.role.push("volunteer");
                }
                if (!user.role.includes("ngoMember")) {
                    user.role.push("ngoMember");
                }
                await user.save();
            }

            // Send notification email to applicant
            try {
                const emailSubject =
                    status === "accepted"
                        ? "Your Volunteer Application Has Been Accepted!"
                        : "Update on Your Volunteer Application";

                const emailHtml =
                    status === "accepted"
                        ? `
                    <h2>Congratulations!</h2>
                    <p>Your volunteer application for <strong>${application.opportunityTitle}</strong> at <strong>${application.ngo.name}</strong> has been accepted!</p>
                    <p>You are now a member of this NGO and can start contributing to their cause.</p>
                    <p>The NGO will contact you soon with further details.</p>
                    <p>Thank you for your commitment to making a difference!</p>
                `
                        : `
                    <h2>Application Update</h2>
                    <p>Thank you for your interest in volunteering for <strong>${application.opportunityTitle}</strong> at <strong>${application.ngo.name}</strong>.</p>
                    <p>Unfortunately, your application was not accepted at this time. This could be due to various reasons such as the position being filled or specific requirements not being met.</p>
                    <p>We encourage you to explore other volunteer opportunities on our platform.</p>
                    <p>Thank you for your willingness to contribute!</p>
                `;

                await sendEmail({
                    to: application.user.email,
                    subject: emailSubject,
                    html: emailHtml,
                });
            } catch (emailError) {
                console.error(
                    "Failed to send status update email:",
                    emailError
                );
                // Continue even if email fails
            }

            return res.status(200).json({
                success: true,
                message: `Application ${status} successfully`,
                result: application,
            });
        } catch (error) {
            console.error("Update application status error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update application status",
                error: error.message,
            });
        }
    }
);

// Check if user has applied for a specific opportunity
router.get(
    "/check/:ngoId/:opportunityId",
    authMiddleware,
    [
        param("ngoId")
            .notEmpty()
            .withMessage("NGO ID is required")
            .isMongoId()
            .withMessage("Invalid NGO ID"),
        param("opportunityId")
            .notEmpty()
            .withMessage("Opportunity ID is required")
            .isInt()
            .withMessage("Opportunity ID must be a number"),
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
            const { ngoId, opportunityId } = req.params;
            const userId = req.user.id;

            const application = await VolunteerApplication.findOne({
                user: userId,
                ngo: ngoId,
                opportunityId: parseInt(opportunityId),
            });

            return res.status(200).json({
                success: true,
                hasApplied: !!application,
                application: application || null,
            });
        } catch (error) {
            console.error("Check application error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to check application status",
                error: error.message,
            });
        }
    }
);

module.exports = router;
