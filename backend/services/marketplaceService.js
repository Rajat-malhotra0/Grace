const Marketplace = require("../models/marketplace");

async function createMarketplaceItem(data) {
    try {
        const marketplaceItem = new Marketplace(data);
        await marketplaceItem.save();
        return await Marketplace.findById(marketplaceItem._id)
            .populate("neededBy", "name email location")
            .populate("donatedBy", "userName email");
    } catch (error) {
        throw error;
    }
}

async function getMarketplaceItems(filter = {}) {
    try {
        const marketplaceItems = await Marketplace.find(filter)
            .populate("neededBy", "name email location")
            .populate("donatedBy", "userName email")
            .sort({ datePosted: -1 });
        return marketplaceItems;
    } catch (error) {
        throw error;
    }
}

async function getMarketplaceItemById(id) {
    try {
        const marketplaceItem = await Marketplace.findById(id)
            .populate("neededBy", "name email location")
            .populate("donatedBy", "userName email");
        return marketplaceItem;
    } catch (error) {
        throw error;
    }
}

async function getMarketplaceItemsByCategory(category) {
    try {
        const items = await Marketplace.find({
            category: category,
            status: "pending",
        })
            .populate("neededBy", "name email location")
            .sort({ urgency: 1, datePosted: -1 });
        return items;
    } catch (error) {
        throw error;
    }
}

async function updateMarketplaceItem(id, data) {
    try {
        const marketplaceItem = await Marketplace.findByIdAndUpdate(id, data, {
            new: true,
        })
            .populate("neededBy", "name email location")
            .populate("donatedBy", "userName email");
        return marketplaceItem;
    } catch (error) {
        throw error;
    }
}

async function fulfillMarketplaceItem(id, donorId) {
    try {
        const item = await Marketplace.findById(id);
        if (!item) {
            throw new Error("Item not found");
        }
        if (item.status !== "pending") {
            throw new Error("Item is not available for fulfillment");
        }

        const updatedItem = await Marketplace.findByIdAndUpdate(
            id,
            {
                status: "fulfilled",
                donatedBy: donorId,
                fulfilledDate: new Date(),
            },
            { new: true }
        )
            .populate("neededBy", "name email location")
            .populate("donatedBy", "userName email");

        return updatedItem;
    } catch (error) {
        throw error;
    }
}

async function deleteMarketplaceItem(id) {
    try {
        const deletedItem = await Marketplace.findByIdAndDelete(id);
        return deletedItem;
    } catch (error) {
        throw error;
    }
}

async function getMarketplaceInsights() {
    try {
        const totalNeeds = await Marketplace.countDocuments();
        const fulfilledNeeds = await Marketplace.countDocuments({
            status: "fulfilled",
        });
        const pendingNeeds = await Marketplace.countDocuments({
            status: "pending",
        });

        const urgentNeeds = await Marketplace.find({
            status: "pending",
            datePosted: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        })
            .populate("neededBy", "name location")
            .sort({ datePosted: 1 });

        return {
            totalNeeds,
            fulfilledNeeds,
            pendingNeeds,
            fulfillmentRate:
                totalNeeds > 0
                    ? ((fulfilledNeeds / totalNeeds) * 100).toFixed(1)
                    : 0,
            urgentNeeds,
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createMarketplaceItem,
    getMarketplaceItems,
    getMarketplaceItemById,
    getMarketplaceItemsByCategory,
    updateMarketplaceItem,
    fulfillMarketplaceItem,
    deleteMarketplaceItem,
    getMarketplaceInsights,
};
