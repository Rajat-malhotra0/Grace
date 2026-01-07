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

async function addVolunteerOpportunity(ngoId, opportunityData) {
    try {
        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        // Get the next ID
        const nextId =
            ngo.volunteer.opportunities.length > 0
                ? Math.max(
                    ...ngo.volunteer.opportunities.map((opp) => opp.id)
                ) + 1
                : 1;

        const newOpportunity = {
            id: nextId,
            title: opportunityData.title,
            description: opportunityData.description,
            peopleNeeded: opportunityData.peopleNeeded,
            duration: opportunityData.duration,
            eventDate: opportunityData.eventDate,
            location: opportunityData.location,
            isOnline: opportunityData.isOnline,
            tags: opportunityData.tags || [],
        };

        ngo.volunteer.opportunities.push(newOpportunity);
        await ngo.save();

        return ngo;
    } catch (error) {
        throw error;
    }
}

async function updateVolunteerOpportunity(
    ngoId,
    opportunityId,
    opportunityData
) {
    try {
        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        const opportunityIndex = ngo.volunteer.opportunities.findIndex(
            (opp) => opp.id === opportunityId
        );

        if (opportunityIndex === -1) {
            throw new Error("Volunteer opportunity not found");
        }

        // Update the opportunity
        ngo.volunteer.opportunities[opportunityIndex] = {
            ...ngo.volunteer.opportunities[opportunityIndex].toObject(),
            ...opportunityData,
            id: opportunityId, // Ensure ID doesn't change
        };

        await ngo.save();
        return ngo;
    } catch (error) {
        throw error;
    }
}

async function deleteVolunteerOpportunity(ngoId, opportunityId) {
    try {
        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        ngo.volunteer.opportunities = ngo.volunteer.opportunities.filter(
            (opp) => opp.id !== opportunityId
        );

        await ngo.save();
        return ngo;
    } catch (error) {
        throw error;
    }
}

async function getVolunteerOpportunities(ngoId) {
    try {
        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        return ngo.volunteer.opportunities;
    } catch (error) {
        throw error;
    }
}

async function addInventoryItem(ngoId, type, itemData) {
    try {
        const validTypes = ["medicine", "food", "clothes", "books", "other"];
        if (!validTypes.includes(type)) {
            throw new Error("Invalid inventory type");
        }

        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        // Ensure inventory object exists
        if (!ngo.inventory) {
            ngo.inventory = {};
        }
        if (!ngo.inventory[type]) {
            ngo.inventory[type] = [];
        }

        ngo.inventory[type].push(itemData);
        await ngo.save();
        return ngo;
    } catch (error) {
        throw error;
    }
}

async function updateInventoryItem(ngoId, type, itemId, itemData) {
    try {
        const validTypes = ["medicine", "food", "clothes", "books", "other"];
        if (!validTypes.includes(type)) {
            throw new Error("Invalid inventory type");
        }

        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        const item = ngo.inventory[type].id(itemId);
        if (!item) {
            throw new Error("Inventory item not found");
        }

        Object.assign(item, itemData);
        await ngo.save();
        return ngo;
    } catch (error) {
        throw error;
    }
}

async function deleteInventoryItem(ngoId, type, itemId) {
    try {
        const validTypes = ["medicine", "food", "clothes", "books", "other"];
        if (!validTypes.includes(type)) {
            throw new Error("Invalid inventory type");
        }

        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            throw new Error("NGO not found");
        }

        ngo.inventory[type].pull(itemId);
        await ngo.save();
        return ngo;
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
    addVolunteerOpportunity,
    updateVolunteerOpportunity,
    deleteVolunteerOpportunity,
    getVolunteerOpportunities,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getAllActiveOpportunities,
};

async function getAllActiveOpportunities() {
    try {
        const currentDate = new Date();
        const ngos = await Ngo.aggregate([
            { $unwind: "$volunteer.opportunities" },
            {
                $match: {
                    "volunteer.opportunities.eventDate": { $gte: currentDate },
                    isActive: true, // Optional: Only active NGOs
                },
            },
            {
                $project: {
                    _id: 1,
                    ngoName: "$name",
                    opportunity: "$volunteer.opportunities",
                },
            },
            { $sort: { "volunteer.opportunities.eventDate": 1 } },
        ]);
        return ngos;
    } catch (error) {
        throw error;
    }
}
