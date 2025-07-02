const express = require("express");
const router = express.Router();
const ngoService = require("../services/ngoService");

router.post("/", async (req, res) => {
    try {
        const ngo = await ngoService.createNgo(req.body);
        if (ngo) {
            res.status(201).json({
                success: true,
                message: "NGO created successfully",
                data: ngo,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create NGO",
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
        const ngos = await ngoService.readNgos(filter);
        res.status(200).json({
            success: true,
            message: "NGOs retrieved successfully",
            data: ngos,
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
        const ngos = await ngoService.readNgos({ _id: req.params.id });
        if (ngos && ngos.length > 0) {
            res.status(200).json({
                success: true,
                message: "NGO retrieved successfully",
                data: ngos[0],
            });
        } else {
            res.status(404).json({
                success: false,
                message: "NGO not found",
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
        const ngo = await ngoService.updateNgo(
            { _id: req.params.id },
            req.body
        );
        if (ngo) {
            res.status(200).json({
                success: true,
                message: "NGO updated successfully",
                data: ngo,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "NGO not found",
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
        await ngoService.deleteNgo({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "NGO deleted successfully",
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
