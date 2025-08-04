const mongoose = require("mongoose");
const connectDB = require("./connect");
const { addCategories } = require("./addCategories");
const { seedCompleteNgoData } = require("./seedCompleteNgoData");
const { addMarketplaceData } = require("./addMarketplaceData");
const { seedUsers } = require("./addUsers");
const { seedTasks } = require("./addTasks");
const { addImpactStories } = require("./addImpactStories");
const { addArticles } = require("./addArticles");
// const { addFeedContent } = require("./addFeedContent");
const seedNgoReports = require("./addNgoReports");
const User = require("../models/user");

const loginUsers = [
    {
        userName: "littlelanterns",
        email: "littlelanterns@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Mumbai", state: "Maharashtra" },
        profileCompleted: true,
        leaderboardPoints: 500,
    },
    {
        userName: "aashasapne",
        email: "aashasapne@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Delhi", state: "Delhi" },
        profileCompleted: true,
        leaderboardPoints: 450,
    },
    {
        userName: "earthnest",
        email: "earthnest@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Bangalore", state: "Karnataka" },
        profileCompleted: true,
        leaderboardPoints: 480,
    },
    {
        userName: "herrise",
        email: "herrise@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Pune", state: "Maharashtra" },
        profileCompleted: true,
        leaderboardPoints: 420,
    },
    {
        userName: "healthfirst",
        email: "healthfirst@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Chennai", state: "Tamil Nadu" },
        profileCompleted: true,
        leaderboardPoints: 510,
    },
    {
        userName: "learningbridge",
        email: "learningbridge@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Kolkata", state: "West Bengal" },
        profileCompleted: true,
        leaderboardPoints: 460,
    },
    {
        userName: "testvolunteer",
        email: "test@volunteer.com",
        password: "password123",
        role: ["volunteer"],
        location: { city: "Delhi", state: "Delhi" },
        profileCompleted: true,
        leaderboardPoints: 150,
    },
    {
        userName: "testdonor",
        email: "test@donor.com",
        password: "password123",
        role: ["donor"],
        location: { city: "Mumbai", state: "Maharashtra" },
        profileCompleted: true,
        leaderboardPoints: 200,
    },
    {
        userName: "testmember",
        email: "test@member.com",
        password: "password123",
        role: ["ngoMember"],
        location: { city: "Bangalore", state: "Karnataka" },
        profileCompleted: true,
        leaderboardPoints: 300,
    },
    {
        userName: "priya_sharma",
        email: "priya.sharma@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Community Outreach",
        location: { city: "Mumbai", state: "Maharashtra" },
        profileCompleted: true,
        leaderboardPoints: 156,
    },
    {
        userName: "raj_patel",
        email: "raj.patel@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Environmental Action",
        location: { city: "Delhi", state: "Delhi" },
        profileCompleted: true,
        leaderboardPoints: 203,
    },
    {
        userName: "ananya_singh",
        email: "ananya.singh@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Education Support",
        location: { city: "Bangalore", state: "Karnataka" },
        profileCompleted: true,
        leaderboardPoints: 134,
    },
    {
        userName: "arjun_kumar",
        email: "arjun.kumar@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Healthcare Support",
        location: { city: "Hyderabad", state: "Telangana" },
        profileCompleted: true,
        leaderboardPoints: 187,
    },
    {
        userName: "meera_joshi",
        email: "meera.joshi@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Women Empowerment",
        location: { city: "Mumbai", state: "Maharashtra" },
        profileCompleted: true,
        leaderboardPoints: 175,
    },
    {
        userName: "sarah_coordinator",
        email: "sarah@littlelanterns.org",
        password: "password123",
        role: ["ngoMember"],
        location: { city: "Mumbai", state: "Maharashtra" },
        profileCompleted: true,
        leaderboardPoints: 198,
    },
    {
        userName: "michael_teacher",
        email: "michael@aashasapne.org",
        password: "password123",
        role: ["ngoMember"],
        location: { city: "Delhi", state: "Delhi" },
        profileCompleted: true,
        leaderboardPoints: 165,
    },
    {
        userName: "lisa_field_manager",
        email: "lisa@earthnest.org",
        password: "password123",
        role: ["ngoMember"],
        location: { city: "Bangalore", state: "Karnataka" },
        profileCompleted: true,
        leaderboardPoints: 142,
    },
    {
        userName: "techcorp_donor",
        email: "donations@techcorp.com",
        password: "password123",
        role: ["donor"],
        location: { city: "Bangalore", state: "Karnataka" },
        profileCompleted: true,
        leaderboardPoints: 95,
    },
    {
        userName: "generous_donor",
        email: "generous@donor.com",
        password: "password123",
        role: ["donor"],
        location: { city: "Chennai", state: "Tamil Nadu" },
        profileCompleted: true,
        leaderboardPoints: 120,
    },
    {
        userName: "admin",
        email: "admin@grace.org",
        password: "admin123",
        role: ["admin"],
        location: { city: "Delhi", state: "Delhi" },
        profileCompleted: true,
        leaderboardPoints: 1000,
    },
];

async function createLoginUsers(keepConnectionOpen = false) {
    try {
        console.log("👤 Creating essential login users for authentication...");

        let createdCount = 0;
        let existingCount = 0;

        for (const userData of loginUsers) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = new User(userData);
                await user.save();
                console.log(
                    `   ✅ Created: ${userData.userName} (${userData.role.join(
                        ","
                    )}) - ${userData.email}`
                );
                createdCount++;
            } else {
                const plainPassword = userData.password;
                user.password = plainPassword;
                user.markModified("password");
                await user.save();
                console.log(
                    `   🔄 Updated: ${userData.userName} (${user.role.join(
                        ","
                    )}) - ${userData.email}`
                );
                existingCount++;
            }

            const verifyUser = await User.findOne({ email: userData.email });
            const isValid = await verifyUser.comparePassword(userData.password);
            if (!isValid) {
                console.log(
                    `   ⚠️  Password verification failed for ${userData.email}`
                );
            } else {
                console.log(`   ✅ Password verified for ${userData.email}`);
            }
        }

        console.log(
            `✅ Login users ready: ${createdCount} created, ${existingCount} already existed`
        );
    } catch (error) {
        console.error("❌ Error creating login users:", error);
        throw error;
    }
}

async function seedAllData() {
    console.log("🚀 Starting complete database seeding...\n");

    try {
        await connectDB();
        console.log("🔗 Master database connection established\n");

        console.log("1️⃣  STEP 1: Adding Categories...");
        console.log("=".repeat(50));
        await addCategories(true);
        console.log("✅ Categories seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("2️⃣  STEP 2: Adding Complete NGOs with Videos & Images...");
        console.log("=".repeat(50));
        await seedCompleteNgoData(true);
        console.log("✅ Complete NGOs seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("3️⃣  STEP 3: Creating Essential Login Users...");
        console.log("=".repeat(50));
        await createLoginUsers(true);
        console.log("✅ Essential login users created\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(
            "4️⃣  STEP 4: Adding Additional Users & NGO Relationships..."
        );
        console.log("=".repeat(50));
        await seedUsers(true);
        console.log("✅ Additional users seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("5️⃣  STEP 5: Adding Tasks...");
        console.log("=".repeat(50));
        await seedTasks(true);
        console.log("✅ Tasks seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("6️⃣  STEP 6: Adding Marketplace Data...");
        console.log("=".repeat(50));
        await addMarketplaceData(true);
        console.log("✅ Marketplace data seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("7️⃣  STEP 7: Adding Impact Stories...");
        console.log("=".repeat(50));
        await addImpactStories(true);
        console.log("✅ Impact Stories seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("8️⃣  STEP 8: Adding Feed Content...");
        console.log("=".repeat(50));
        // await addFeedContent(true);
        console.log("✅ Feed Content seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("9️⃣  STEP 9: Adding Articles for Chatbot...");
        console.log("=".repeat(50));
        await addArticles(true);
        console.log("✅ Articles seeding completed\n");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("🔟  STEP 10: Adding NGO Reports...");
        console.log("=".repeat(50));
        await seedNgoReports(true);
        console.log("✅ NGO Reports seeding completed\n");

        console.log("🎉 COMPLETE DATABASE SEEDING FINISHED SUCCESSFULLY!");
        console.log("=".repeat(60));
        console.log("✅ All data has been seeded successfully!");
        console.log("📊 Summary:");
        console.log("   • Categories: NGO & Donation categories added");
        console.log("   • NGOs: Complete NGOs with Cloudinary videos & images");
        console.log("   • Login Users: Authentication users for all roles");
        console.log("   • Projects: All projects with uploaded images");
        console.log("   • Volunteer Opportunities: Detailed volunteer data");
        console.log("   • Donation Options: Complete donation configurations");
        console.log(
            "   • Users: Diverse users with leaderboard stats & NGO relationships"
        );
        console.log("   • Tasks: Volunteer tasks with progress tracking");
        console.log("   • Marketplace: Items with pricing & availability");
        console.log("   • Impact Stories: User success stories");
        console.log("   • Feed Content: Social media style posts");
        console.log("   • Articles: Chatbot knowledge base articles");
        console.log("   • NGO Reports: Detailed NGO performance reports");
        console.log("=".repeat(60));
        console.log("📝 LOGIN CREDENTIALS:");
        console.log("   • Administrator: admin@grace.org / admin123");
        console.log("   • Test Users:");
        console.log("     - test@volunteer.com / password123 (volunteer)");
        console.log("     - test@donor.com / password123 (donor)");
        console.log("     - test@member.com / password123 (ngoMember)");
        console.log("   • Common Volunteers:");
        console.log("     - priya.sharma@example.com / password123");
        console.log("     - raj.patel@example.com / password123");
        console.log("     - ananya.singh@example.com / password123");
        console.log("     - arjun.kumar@example.com / password123");
        console.log("     - meera.joshi@example.com / password123");
        console.log("   • NGO Members:");
        console.log("     - sarah@littlelanterns.org / password123");
        console.log("     - michael@aashasapne.org / password123");
        console.log("     - lisa@earthnest.org / password123");
        console.log("   • Donors:");
        console.log("     - donations@techcorp.com / password123");
        console.log("     - generous@donor.com / password123");
        console.log("   • NGO Admins:");
        console.log("     - littlelanterns@grace.org / password123");
        console.log("     - aashasapne@grace.org / password123");
        console.log("     - earthnest@grace.org / password123 (and more...)");
        console.log("=".repeat(60));

        console.log("\n🚀 Your Grace application is now ready to use!");
        console.log(
            "🔗 Frontend can access NGOs at: http://localhost:3001/api/ngos"
        );
        console.log("📱 All NGO pages will work with database IDs");
        console.log("🎥 Hero videos and images served from Cloudinary");
    } catch (error) {
        console.error("❌ ERROR during database seeding:", error);
        console.log("\n💡 Troubleshooting Tips:");
        console.log("   1. Make sure MongoDB is running");
        console.log("   2. Check your database connection in connect.js");
        console.log("   3. Ensure all model files are properly configured");
        console.log("   4. Check if you have sufficient permissions");

        throw error;
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("🔒 Master database connection closed");
        }
    }
}

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
