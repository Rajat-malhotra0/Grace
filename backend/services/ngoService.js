const Ngo = require("../models/ngo");

async function createNgo(data) {
    try {
        const ngo = new Ngo(data);
        await ngo.save();
        return ngo;
    } catch (error) {
        console.error("Error creating NGO:", error);
    }
}

async function readNgos(filter = {}) {
    try {
        const ngos = await Ngo.find(filter);
        return ngos;
    } catch (error) {
        console.error("Error reading NGOs:", error);
    }
}

async function updateNgo(filter = {}, data = {}) {
    try {
        const ngo = await Ngo.findOneAndUpdate(filter, data, {
            new: true,
        });
        return ngo;
    } catch (error) {
        console.error("Error updating NGO:", error);
    }
}

async function deleteNgo(filter = {}) {
    try {
        await Ngo.deleteOne(filter);
    } catch (error) {
        console.error("Error deleting NGO:", error);
    }
}

module.exports = {
    createNgo,
    readNgos,
    updateNgo,
    deleteNgo,
};
