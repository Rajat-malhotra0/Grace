const marketplaceService = require("../services/marketplaceService");
const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

// Create new marketplace item
router.post(
    "/",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("quantity").isNumeric().withMessage("Quantity must be a number"),
        body("category").notEmpty().withMessage("Category is required"),
        body("neededBy").notEmpty().withMessage("NGO ID is required"),
        body("neededTill").isISO8601().withMessage("Valid date is required"),
        body("location").notEmpty().withMessage("Location is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const marketplaceItem =
                await marketplaceService.createMarketplaceItem(req.body);
            return res.status(201).json(marketplaceItem);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Get all marketplace items with optional filters
router.get("/", async (req, res) => {
    try {
        const { category, status, urgency, location } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (urgency) filter.urgency = urgency;
        if (location) filter.location = new RegExp(location, "i");

        const marketplaceItems = await marketplaceService.getMarketplaceItems(
            filter
        );
        return res.status(200).json(marketplaceItems);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/insights", async (req, res) => {
    try {
        const insights = await marketplaceService.getMarketplaceInsights();
        return res.status(200).json(insights);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const items = await marketplaceService.getMarketplaceItemsByCategory(
            category
        );
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get specific marketplace item
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const marketplaceItem = await marketplaceService.getMarketplaceItemById(
            id
        );
        if (!marketplaceItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        return res.status(200).json(marketplaceItem);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Update marketplace item
router.put(
    "/:id",
    [
        body("name").optional().notEmpty().withMessage("Name cannot be empty"),
        body("description")
            .optional()
            .notEmpty()
            .withMessage("Description cannot be empty"),
        body("quantity")
            .optional()
            .isNumeric()
            .withMessage("Quantity must be a number"),
    ],
    async (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedItem = await marketplaceService.updateMarketplaceItem(
                id,
                req.body
            );
            if (!updatedItem) {
                return res.status(404).json({ error: "Item not found" });
            }
            return res.status(200).json(updatedItem);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Fulfill marketplace item (donor action)
router.post("/:id/fulfill", async (req, res) => {
    const { id } = req.params;
    const { donorId } = req.body;

    if (!donorId) {
        return res.status(400).json({ error: "Donor ID is required" });
    }

    try {
        const fulfilledItem = await marketplaceService.fulfillMarketplaceItem(
            id,
            donorId
        );
        return res.status(200).json(fulfilledItem);
    } catch (error) {
        if (error.message === "Item not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Item is not available for fulfillment") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Delete marketplace item
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await marketplaceService.deleteMarketplaceItem(id);
        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
