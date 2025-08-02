const mongoose = require("mongoose");
const Ngo = require("../models/ngo");
const User = require("../models/user");
const Category = require("../models/category");
const connectDB = require("./connect");
const { uploadImage } = require("../services/imageStoreService"); // Import Cloudinary service
const path = require("path");

// Mock NGO data (copied from frontend MockNgoData.js)
const ngoMockData = [
    {
        name: "Little Lanterns",
        description:
            "Because every child is a light waiting to shine. Little Lanterns is dedicated to nurturing the dreams, dignity, and development of underprivileged children. From education and nutrition to emotional well-being, we work to ensure that every child gets the chance to shine bright — because every child deserves a childhood full of hope and wonder.",
        category: "Children",
        volunteersNeeded: 125,
        donationGoal: 25000,
        imagePath: "ngo1.jpg",
    },
    {
        name: "Aasha Sapne",
        description:
            "Aasha Sapne empowers children from underserved communities by providing access to quality education, creative expression, and safe spaces to grow. We believe every child carries a spark — with a little hope and support, their dreams can light up the world.",
        category: "Children",
        volunteersNeeded: 85,
        donationGoal: 18000,
        imagePath: "ngo2.jpg",
    },
    {
        name: "EarthNest",
        description:
            "EarthNest is devoted to healing our planet through community-driven reforestation, clean-up drives, and sustainable living education. We aim to reconnect people with nature — one tree, one river, one mindful habit at a time. Because protecting Earth is protecting our only home.",
        category: "Environment",
        volunteersNeeded: 200,
        donationGoal: 35000,
        imagePath: "ngo3.jpg",
    },
    {
        name: "HerRise",
        description:
            "HerRise is committed to empowering women through education, vocational training, leadership development, and legal support. We believe that when a woman rises, her family, her community, and the world rise with her — and we're here to walk with her every step of the way.",
        category: "Women Empowerment",
        volunteersNeeded: 300,
        donationGoal: 50000,
        imagePath: "ngo4.jpg",
    },
    {
        name: "HealthFirst Initiative",
        description:
            "HealthFirst Initiative is dedicated to providing accessible healthcare services to underserved communities. We focus on preventive care, health education, and mobile medical camps to ensure that quality healthcare reaches every corner of society. Because health is a fundamental right, not a privilege.",
        category: "Health",
        volunteersNeeded: 150,
        donationGoal: 30000,
        imagePath: "ngo6.png",
    },
    {
        name: "Learning Bridge",
        description:
            "Learning Bridge connects underprivileged students with quality education through innovative teaching methods, scholarships, and mentorship programs. We believe education is the most powerful weapon to change the world, and we're committed to making it accessible to all.",
        category: "Education",
        volunteersNeeded: 180,
        donationGoal: 22000,
        imagePath: "ngo5.jpg",
    },
];

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(imagePath) {
    try {
        const fullPath = path.join(
            __dirname,
            "../../frontend/src/assets",
            imagePath
        );
        const result = await uploadImage(fullPath, "grace-ngos");
        console.log(`📸 Uploaded ${imagePath} to Cloudinary`);

        // Transform the result to match NGO model structure
        return {
            url: result.url,
            publicId: result.publicId,
            alt: `${imagePath} - NGO cover image`,
        };
    } catch (error) {
        console.error(`❌ Error uploading image ${imagePath}:`, error.message);
        return {
            url: "",
            publicId: "",
            alt: "",
        };
    }
}

async function createMockUsers() {
    console.log("👥 Creating mock users for NGOs...");

    const mockUsers = [];

    for (let i = 0; i < ngoMockData.length; i++) {
        const ngoData = ngoMockData[i];
        const user = new User({
            userName: ngoData.name.toLowerCase().replace(/\s+/g, "_"),
            email: `${ngoData.name
                .toLowerCase()
                .replace(/\s+/g, "")}@example.com`,
            password: "password123", // This will be hashed by the pre-save hook
            role: ["ngo"],
            termsAccepted: true,
            isActive: true,
        });

        await user.save();
        mockUsers.push(user);
        console.log(`✅ Created user: ${user.userName}`);
    }

    return mockUsers;
}

async function findOrCreateCategories() {
    console.log("📂 Finding or creating categories...");

    const categoryMap = new Map();
    const uniqueCategories = [
        ...new Set(ngoMockData.map((ngo) => ngo.category)),
    ];

    for (const categoryName of uniqueCategories) {
        let category = await Category.findOne({ name: categoryName });

        if (!category) {
            category = new Category({
                name: categoryName,
                description: `${categoryName} related activities and causes`,
                type: "ngo", // Use "ngo" as the type since these are NGO categories
            });
            await category.save();
            console.log(`✅ Created category: ${categoryName}`);
        } else {
            console.log(`📁 Found existing category: ${categoryName}`);
        }

        categoryMap.set(categoryName, category._id);
    }

    return categoryMap;
}

const seedNgos = async (keepConnectionOpen = false) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("🔗 Connected to database");
        }

        // Clear existing NGO data
        console.log("🗑️  Removing existing NGOs...");
        const deletedNgos = await Ngo.deleteMany({});
        console.log(`✅ Deleted ${deletedNgos.deletedCount} existing NGOs`);

        // Clear existing mock users (optional - be careful with this in production)
        console.log("�️  Removing existing mock users...");
        const deletedUsers = await User.deleteMany({
            email: { $regex: /@example\.com$/ },
        });
        console.log(`✅ Deleted ${deletedUsers.deletedCount} mock users`);

        // Create mock users
        const mockUsers = await createMockUsers();

        // Find or create categories
        const categoryMap = await findOrCreateCategories();

        // Create NGOs with Cloudinary images
        console.log("🏢 Creating NGOs with Cloudinary images...");

        const createdNgos = [];

        for (let i = 0; i < ngoMockData.length; i++) {
            const ngoData = ngoMockData[i];
            const user = mockUsers[i];

            // Upload image to Cloudinary using the existing image path
            const cloudinaryResult = await uploadImageToCloudinary(
                ngoData.imagePath
            );

            const ngo = new Ngo({
                user: user._id,
                name: ngoData.name,
                description: ngoData.description,
                category: [categoryMap.get(ngoData.category)],
                contact: {
                    email: `${ngoData.name
                        .toLowerCase()
                        .replace(/\s+/g, "")}@example.com`,
                    phone: "+91-9876543210",
                    website: `https://www.${ngoData.name
                        .toLowerCase()
                        .replace(/\s+/g, "")}.org`,
                },
                volunteersNeeded: ngoData.volunteersNeeded,
                donationGoal: ngoData.donationGoal,
                otherCauses: `${ngoData.category} related activities and community development`,
                coverImage: cloudinaryResult,
                isVerified: true,
                isActive: true,
            });

            await ngo.save();
            createdNgos.push(ngo);
            console.log(
                `✅ Created NGO: ${ngoData.name} with Cloudinary image`
            );
        }

        console.log("🎉 Successfully created 6 NGOs!");

        // Verification step
        console.log("📊 Summary:");
        console.log(`   - Users created: ${mockUsers.length}`);
        console.log(`   - Categories used: ${categoryMap.size}`);
        console.log(`   - NGOs created: ${createdNgos.length}`);

        // Verify each NGO exists in database
        console.log("� Created NGOs:");
        for (let i = 0; i < createdNgos.length; i++) {
            const ngo = createdNgos[i];
            const verification = await Ngo.findById(ngo._id);
            console.log(
                `   ${i + 1}. ${ngo.name} - ${
                    verification ? "✅ Verified" : "❌ Not found"
                }`
            );
        }

        if (!keepConnectionOpen) {
            console.log("🔒 Closing database connection...");
            mongoose.connection.close();
            console.log("✅ Database connection closed");
        }
    } catch (error) {
        console.error("❌ Error seeding NGOs:", error);
        throw error;
    }
};

// Run the seeding function
if (require.main === module) {
    seedNgos()
        .then(() => {
            console.log("🏁 NGO seeding completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 NGO seeding failed:", error);
            process.exit(1);
        });
}

module.exports = { seedNgos };
