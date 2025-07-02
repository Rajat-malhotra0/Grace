const Donation = require("../models/donation");

async function createDonation(data) {
    try {
        const donation = new Donation(data);
        await donation.save();
        return donation;
    } catch (error) {
        console.error("Error creating donation:", error);
    }
}

async function readDonations(filter = {}) {
    try {
        const donations = await Donation.find(filter);
        return donations;
    } catch (error) {
        console.error("Error reading donations:", error);
    }
}

async function updateDonation(filter = {}, data = {}) {
    try {
        const donation = await Donation.findOneAndUpdate(filter, data, {
            new: true,
        });
        return donation;
    } catch (error) {
        console.error("Error updating donation:", error);
    }
}

async function deleteDonation(filter = {}) {
    try {
        await Donation.deleteOne(filter);
    } catch (error) {
        console.error("Error deleting donation:", error);
    }
}

module.exports = {
    createDonation,
    readDonations,
    updateDonation,
    deleteDonation,
};
