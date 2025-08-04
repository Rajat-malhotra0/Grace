const mongoose = require("mongoose");
const connectDB = require("./connect");
const { addCategories } = require("./addCategories");
const { seedNgos } = require("./addNgo");
const { addMarketplaceData } = require("./addMarketplaceData");
const { seedUsers } = require("./addUsers");
const { seedTasks } = require("./addTasks");
const { addImpactStories } = require("./addImpactStories");
const { addFeedContent } = require("./addFeedContent");
const seedNgoReports = require("./addNgoReports");

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

        // Step 3: Add Users (requires NGOs to exist for associations)
        console.log("3️⃣  STEP 3: Adding Users & NGO Relationships...");
        console.log("=".repeat(50));
        await seedUsers(true); // Keep connection open
        console.log("✅ Users seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 4: Add Tasks (requires NGOs and Users to exist)
        console.log("4️⃣  STEP 4: Adding Tasks...");
        console.log("=".repeat(50));
        await seedTasks(true); // Keep connection open
        console.log("✅ Tasks seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 5: Add Marketplace Data (requires NGOs to exist)
        console.log("5️⃣  STEP 5: Adding Marketplace Data...");
        console.log("=".repeat(50));
        await addMarketplaceData(true); // Keep connection open
        console.log("✅ Marketplace data seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 6: Add Impact Stories (requires Tasks and Users to exist)
        console.log("6️⃣  STEP 6: Adding Impact Stories...");
        console.log("=".repeat(50));
        await addImpactStories(true); // Keep connection open
        console.log("✅ Impact Stories seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 7: Add Feed Content (requires Users to exist)
        console.log("7️⃣  STEP 7: Adding Feed Content...");
        console.log("=".repeat(50));
        await addFeedContent(true); // Keep connection open
        console.log("✅ Feed Content seeding completed\n");

        // Wait a moment between operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 8: Add NGO Reports (requires NGOs and Users to exist)
        console.log("8️⃣  STEP 8: Adding NGO Reports...");
        console.log("=".repeat(50));
        await seedNgoReports(true); // Keep connection open
        console.log("✅ NGO Reports seeding completed\n");

        console.log("🎉 COMPLETE DATABASE SEEDING FINISHED SUCCESSFULLY!");
        console.log("=".repeat(60));
        console.log("✅ All data has been seeded successfully!");
        console.log("📊 Summary:");
        console.log("   • Categories: NGO & Donation categories added");
        console.log("   • NGOs: Sample NGOs with Cloudinary images");
        console.log(
            "   • Users: Diverse users with leaderboard stats & NGO relationships"
        );
        console.log("   • Tasks: NGO-specific tasks for team management");
        console.log("   • Marketplace: Real donation needs from frontend data");
        console.log("   • Impact Stories: Inspiring stories linked to tasks");
        console.log("   • Feed Content: Social feed posts from users");
        console.log(
            "   • NGO Reports: Sample issue reports for NGO management"
        );
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
