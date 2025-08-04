const Ngo = require("../models/ngo");

async function createNgo(data) {
    try {
        const ngo = new Ngo(data);
        await ngo.save();
        return ngo;
    } catch (error) {
        throw error;
    }
}

async function readNgos(filter = {}) {
    try {
        const ngos = await Ngo.find(filter)
            .populate("category", "name")
            .populate("user", "userName email location");
        return ngos;
    } catch (error) {
        throw error;
    }
}

async function updateNgo(filter = {}, data = {}) {
    try {
        const ngo = await Ngo.findOneAndUpdate(filter, data, {
            new: true,
        });
        return ngo;
    } catch (error) {
        throw error;
    }
}

async function deleteNgo(filter = {}) {
    try {
        await Ngo.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createNgo,
    readNgos,
    updateNgo,
    deleteNgo,
};
