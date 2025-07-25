const Donation = require("../models/donation");

async function createDonation(data) {
    try {
        const donation = new Donation(data);
        await donation.save();
        return donation.populate('user', 'userName email role');
    } catch (error) {
        throw error;
    }
}

async function readDonations(filter = {}) {
    try {
        const donations = await Donation.find(filter);
        return donations;

    } catch (error) {
        throw error;
    }
}

async function updateDonation(filter = {}, data = {}) {
    try {
        const donation = await Donation.findOneAndUpdate(filter, data, {
            new: true,
        });
        return donation;
    } catch (error) {
        throw error;
    }
}

async function deleteDonation(filter = {}) {
    try {
        await Donation.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createDonation,
    readDonations,
    updateDonation,
    deleteDonation,
};
