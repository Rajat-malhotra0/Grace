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
        console.log("ngoService.readNgos - Called with filter:", filter);
        
        // By default, only show verified and active NGOs unless explicitly specified
        if (!("isVerified" in filter)) {
            filter.isVerified = true;
        }
        if (!("isActive" in filter)) {
            filter.isActive = true;
        }

        console.log("ngoService.readNgos - Final filter to be used:", filter);
        
        const ngos = await Ngo.find(filter)
            .populate("category", "name")
            .populate("user", "userName email location");
            
        console.log("ngoService.readNgos - Found NGOs:", ngos?.length || 0);
        return ngos;
    } catch (error) {
        console.error("ngoService.readNgos - Error:", error);
        console.error("ngoService.readNgos - Error stack:", error.stack);
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

async function getPendingNgos() {
    try {
        console.log("Fetching pending NGOs...");
        const ngos = await Ngo.find({ isVerified: false, isActive: true })
            .populate("category", "name")
            .populate("user", "userName email location createdAt")
            .sort({ createdAt: -1 });
        console.log(`Found ${ngos.length} pending NGOs in database`);
        return ngos;
    } catch (error) {
        console.error("Error in getPendingNgos:", error);
        throw error;
    }
}

async function verifyNgo(ngoId, isApproved) {
    try {
        const updateData = isApproved
            ? { isVerified: true }
            : { isVerified: false, isActive: false };

        const ngo = await Ngo.findByIdAndUpdate(ngoId, updateData, {
            new: true,
        }).populate("user", "userName email");

        if (!ngo) {
            throw new Error("NGO not found");
        }

        return ngo;
    } catch (error) {
        throw error;
    }
}

async function getNgoStats() {
    try {
        const totalNgos = await Ngo.countDocuments({ isActive: true });
        const verifiedNgos = await Ngo.countDocuments({
            isVerified: true,
            isActive: true,
        });
        const pendingNgos = await Ngo.countDocuments({
            isVerified: false,
            isActive: true,
        });

        return {
            total: totalNgos,
            verified: verifiedNgos,
            pending: pendingNgos,
        };
    } catch (error) {
        throw error;
    }
}

async function getAllNgos(filter = {}) {
    try {
        // Admin function to get all NGOs without verification filter
        const ngos = await Ngo.find(filter)
            .populate("category", "name")
            .populate("user", "userName email location");
        return ngos;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createNgo,
    readNgos,
    updateNgo,
    deleteNgo,
    getPendingNgos,
    verifyNgo,
    getNgoStats,
    getAllNgos,
};
