const express = require("express");
const router = express.Router();
const donationService = require("../services/donationService");

router.post("/", async (req, res) => {
    try {
        const donation = await donationService.createDonation(req.body);
        if (donation) {
            res.status(201).json({
                success: true,
                message: "Donation created successfully",
                data: donation,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create donation",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const filter = req.query;
        const donations = await donationService.readDonations(filter);
        res.status(200).json({
            success: true,
            message: "Donations retrieved successfully",
            data: donations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const donations = await donationService.readDonations({
            _id: req.params.id,
        });
        if (donations && donations.length > 0) {
            res.status(200).json({
                success: true,
                message: "Donation retrieved successfully",
                data: donations[0],
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Donation not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const donation = await donationService.updateDonation(
            { _id: req.params.id },
            req.body
        );
        if (donation) {
            res.status(200).json({
                success: true,
                message: "Donation updated successfully",
                data: donation,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Donation not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await donationService.deleteDonation({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Donation deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
