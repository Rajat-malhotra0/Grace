const Marketplace = require("../models/marketplace");

async function createMarketplaceItem(data) {
    try {
        const marketplaceItem = new Marketplace(data);
        await marketplaceItem.save();
        // Fetch the saved item with population
        return await Marketplace.findById(marketplaceItem._id)
            .populate("neededBy", "name email")
            .populate("donatedBy", "userName email");
    } catch (error) {
        throw error;
    }
}

async function readMarketplaceItems(filter = {}) {
    try {
        const marketplaceItems = await Marketplace.find(filter)
            .populate("neededBy", "name email")
            .populate("donatedBy", "userName email");
        return marketplaceItems;
    } catch (error) {
        throw error;
    }
}
async function updateMarketplaceItem(filter = {}, data = {}) {
    try {
        const marketplaceItem = await Marketplace.findOneAndUpdate(
            filter,
            data,
            {
                new: true,
            }
        )
            .populate("neededBy", "name email")
            .populate("donatedBy", "userName email");
        return marketplaceItem;
    } catch (error) {
        throw error;
    }
}

async function deleteMarketplaceItem(filter = {}) {
    try {
        await Marketplace.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createMarketplaceItem,
    readMarketplaceItems,
    updateMarketplaceItem,
    deleteMarketplaceItem,
};
