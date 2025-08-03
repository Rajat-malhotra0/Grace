const mongoose = require("mongoose");
const NgoReport = require("../models/ngoReport");
const Ngo = require("../models/ngo");
const User = require("../models/user");
const connectDB = require("./connect");

const sampleReports = [
    {
        title: "Leaking tap in kitchen",
        description:
            "The main kitchen tap has been leaking since yesterday evening, causing water wastage.",
        category: "Facilities",
        urgency: "Medium",
        dateOfIncident: new Date("2025-01-20"),
        reportedBy: "Anita Sharma",
        status: "pending",
    },
    {
        title: "Shortage of diapers",
        description:
            "Running critically low on diapers in the children's room. Need immediate restocking.",
        category: "Supplies",
        urgency: "High",
        dateOfIncident: new Date("2025-01-21"),
        reportedBy: "Rahul Verma",
        status: "pending",
    },
    {
        title: "Broken wheelchair",
        description:
            "One of the wheelchairs has a damaged wheel and needs repair.",
        category: "Other",
        urgency: "Medium",
        dateOfIncident: new Date("2025-01-19"),
        reportedBy: "Priya Singh",
        status: "pending",
    },
    {
        title: "Staff shortage in evening shift",
        description: "Not enough volunteers for the evening shift this week.",
        category: "Personnel",
        urgency: "High",
        dateOfIncident: new Date("2025-01-22"),
        reportedBy: "Amit Kumar",
        status: "pending",
    },
    {
        title: "Computer not working",
        description: "Main computer in the office is not starting up.",
        category: "Technology",
        urgency: "Low",
        dateOfIncident: new Date("2025-01-18"),
        reportedBy: "Sarah Johnson",
        status: "resolved",
    },
];

async function seedNgoReports() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Clear existing reports
        await NgoReport.deleteMany({});
        console.log("Cleared existing NGO reports");

        // Get "Little Lanterns" NGO and worker@gmail.com user for the reports
        const littleLanternsNgo = await Ngo.findOne({
            name: "Little Lanterns",
        });
        const workerUser = await User.findOne({ email: "worker@gmail.com" });

        if (!littleLanternsNgo || !workerUser) {
            console.log(
                "Little Lanterns NGO or worker@gmail.com user not found. Please create them first."
            );
            return;
        }

        // Add NGO and User references to sample reports
        const reportsWithRefs = sampleReports.map((report) => ({
            ...report,
            ngo: littleLanternsNgo._id,
            reportedByUser: workerUser._id,
        }));

        // Insert sample reports
        const insertedReports = await NgoReport.insertMany(reportsWithRefs);
        console.log(`Inserted ${insertedReports.length} sample NGO reports`);

        console.log("Sample NGO reports:");
        insertedReports.forEach((report) => {
            console.log(
                `- ${report.title} (${report.urgency} priority, ${report.status})`
            );
        });
    } catch (error) {
        console.error("Error seeding NGO reports:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

// Run if called directly
if (require.main === module) {
    seedNgoReports();
}

module.exports = seedNgoReports;
