const mongoose = require("mongoose");
const connectDB = require("./connect");
const { addCategories } = require("./addCategories");
const { seedNgos } = require("./addNgo");
const { addMarketplaceData } = require("./addMarketplaceData");

/**
 * Master seeder script to populate the entire database
 * Run this script to seed all data in the correct order
 */

async function seedAllData() {
    console.log("🚀 Starting complete database seeding...\n");

    try {
        // Connect to database once at the beginning
        await connectDB();
        console.log("🔗 Master database connection established\n");

        // Step 1: Add Categories (both NGO and donation categories)
        console.log("1️⃣  STEP 1: Adding Categories...");
        console.log("=".repeat(50));
        await addCategories(true); // Keep connection open
        console.log("✅ Categories seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 2: Add NGOs (requires categories to exist)
        console.log("2️⃣  STEP 2: Adding NGOs...");
        console.log("=".repeat(50));
        await seedNgos(true); // Keep connection open
        console.log("✅ NGOs seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 3: Add Marketplace Data (requires NGOs to exist)
        console.log("3️⃣  STEP 3: Adding Marketplace Data...");
        console.log("=".repeat(50));
        await addMarketplaceData(true); // Keep connection open
        console.log("✅ Marketplace data seeding completed\n");

        console.log("🎉 COMPLETE DATABASE SEEDING FINISHED SUCCESSFULLY!");
        console.log("=".repeat(60));
        console.log("✅ All data has been seeded successfully!");
        console.log("📊 Summary:");
        console.log("   • Categories: NGO & Donation categories added");
        console.log("   • NGOs: Sample NGOs with Cloudinary images");
        console.log("   • Marketplace: Real donation needs from frontend data");
        console.log("   • Users: Mock users for NGO authentication");
        console.log("\n🚀 Your Grace application is now ready to use!");
    } catch (error) {
        console.error("❌ ERROR during database seeding:", error);
        console.log("\n💡 Troubleshooting Tips:");
        console.log("   1. Make sure MongoDB is running");
        console.log("   2. Check your database connection in connect.js");
        console.log("   3. Ensure all model files are properly configured");
        console.log("   4. Check if you have sufficient permissions");

        throw error;
    } finally {
        // Close the database connection at the very end
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("🔒 Master database connection closed");
        }
    }
}

// Run the master seeder
if (require.main === module) {
    seedAllData()
        .then(() => {
            console.log("\n🏁 Master seeding process completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Master seeding process failed:", error);
            process.exit(1);
        });
}

module.exports = { seedAllData };
