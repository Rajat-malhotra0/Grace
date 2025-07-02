const ImpactStory = require("../models/impactStory");

async function createImpactStory(data) {
    try {
        const impactStory = new ImpactStory(data);
        await impactStory.save();
        return impactStory;
    } catch (error) {
        console.error("Error creating impact story:", error);
    }
}

async function readImpactStories(filter = {}) {
    try {
        const impactStories = await ImpactStory.find(filter);
        return impactStories;
    } catch (error) {
        console.error("Error reading impact stories:", error);
    }
}

async function updateImpactStory(filter = {}, data = {}) {
    try {
        const impactStory = await ImpactStory.findOneAndUpdate(filter, data, {
            new: true,
        });
        return impactStory;
    } catch (error) {
        console.error("Error updating impact story:", error);
    }
}

async function deleteImpactStory(filter = {}) {
    try {
        await ImpactStory.deleteOne(filter);
    } catch (error) {
        console.error("Error deleting impact story:", error);
    }
}

module.exports = {
    createImpactStory,
    readImpactStories,
    updateImpactStory,
    deleteImpactStory,
};
