const NgoReport = require("../models/ngoReport");

async function createNgoReport(data) {
    try {
        const ngoReport = new NgoReport(data);
        await ngoReport.save();
        return ngoReport;
    } catch (error) {
        throw error;
    }
}

async function readNgoReports(filter = {}) {
    try {
        const ngoReports = await NgoReport.find(filter)
            .populate("ngo", "name")
            .populate("reportedByUser", "userName email")
            .sort({ createdAt: -1 });
        return ngoReports;
    } catch (error) {
        throw error;
    }
}

async function updateNgoReport(filter = {}, data = {}) {
    try {
        const ngoReport = await NgoReport.findOneAndUpdate(filter, data, {
            new: true,
        });
        return ngoReport;
    } catch (error) {
        throw error;
    }
}

async function deleteNgoReport(filter = {}) {
    try {
        await NgoReport.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

async function resolveNgoReport(reportId) {
    try {
        const ngoReport = await NgoReport.findByIdAndUpdate(
            reportId,
            {
                status: "resolved",
                resolvedOn: new Date(),
                updatedAt: new Date(),
            },
            { new: true }
        );
        return ngoReport;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createNgoReport,
    readNgoReports,
    updateNgoReport,
    deleteNgoReport,
    resolveNgoReport,
};
