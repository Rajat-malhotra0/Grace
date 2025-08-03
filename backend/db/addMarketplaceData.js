const mongoose = require("mongoose");
const Marketplace = require("../models/marketplace");
const NGO = require("../models/ngo");
const User = require("../models/user");
const Category = require("../models/category");
const connectDB = require("./connect");
const bcrypt = require("bcryptjs");

// Sample user data for NGO accounts
const sampleUsers = [
    {
        userName: "hopefoundation",
        email: "contact@hopefoundation.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Mumbai",
            state: "Maharashtra",
        },
    },
    {
        userName: "careindia",
        email: "info@careindia.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Delhi",
            state: "NCR",
        },
    },
    {
        userName: "smilefoundation",
        email: "hello@smilefoundation.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Bangalore",
            state: "Karnataka",
        },
    },
    {
        userName: "akshayapatra",
        email: "contact@akshayapatra.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Hyderabad",
            state: "Telangana",
        },
    },
    {
        userName: "clothingtheneedy",
        email: "support@clothingtheneedy.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Chennai",
            state: "Tamil Nadu",
        },
    },
    {
        userName: "digitallearninghub",
        email: "info@digitallearninghub.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Pune",
            state: "Maharashtra",
        },
    },
    {
        userName: "healthforall",
        email: "contact@healthforall.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Nagpur",
            state: "Maharashtra",
        },
    },
    {
        userName: "literacyforall",
        email: "contact@literacyforall.org",
        password: "password123",
        role: ["ngo"],
        location: {
            city: "Kochi",
            state: "Kerala",
        },
    },
];

// Sample NGO data to match the donation needs
const sampleNGOs = [
    {
        name: "Hope Foundation",
        description:
            "Dedicated to providing food and nutrition support to underprivileged communities",
        registerationId: "NGO001",
        yearEstablished: 2010,
        contact: {
            email: "contact@hopefoundation.org",
            phone: "+91-9876543210",
            website: "",
        },
        otherCauses: "Community development and poverty alleviation",
        userEmail: "contact@hopefoundation.org",
    },
    {
        name: "Care India",
        description:
            "Working towards sustainable development and poverty alleviation",
        registerationId: "NGO002",
        yearEstablished: 2008,
        contact: {
            email: "info@careindia.org",
            phone: "+91-9876543211",
            website: "",
        },
        otherCauses: "Healthcare and nutrition programs",
        userEmail: "info@careindia.org",
    },
    {
        name: "Smile Foundation",
        description:
            "Empowering underprivileged children through education and healthcare",
        registerationId: "NGO003",
        yearEstablished: 2012,
        contact: {
            email: "hello@smilefoundation.org",
            phone: "+91-9876543212",
            website: "",
        },
        otherCauses: "Child welfare and development",
        userEmail: "hello@smilefoundation.org",
    },
    {
        name: "Akshaya Patra",
        description: "Providing mid-day meals to school children across India",
        registerationId: "NGO004",
        yearEstablished: 2000,
        contact: {
            email: "contact@akshayapatra.org",
            phone: "+91-9876543213",
            website: "",
        },
        otherCauses: "Educational support and nutrition",
        userEmail: "contact@akshayapatra.org",
    },
    {
        name: "Clothing the Needy",
        description:
            "Distributing clothes and essentials to homeless and needy people",
        registerationId: "NGO005",
        yearEstablished: 2015,
        contact: {
            email: "support@clothingtheneedy.org",
            phone: "+91-9876543214",
            website: "",
        },
        otherCauses: "Shelter and basic necessities",
        userEmail: "support@clothingtheneedy.org",
    },
    {
        name: "Digital Learning Hub",
        description: "Bridging the digital divide through technology education",
        registerationId: "NGO006",
        yearEstablished: 2018,
        contact: {
            email: "info@digitallearninghub.org",
            phone: "+91-9876543215",
            website: "",
        },
        otherCauses: "Technology education and digital literacy",
        userEmail: "info@digitallearninghub.org",
    },
    {
        name: "Health for All Foundation",
        description:
            "Providing healthcare services and medical supplies to rural areas",
        registerationId: "NGO007",
        yearEstablished: 2009,
        contact: {
            email: "contact@healthforall.org",
            phone: "+91-9876543216",
            website: "",
        },
        otherCauses: "Rural healthcare and medical awareness",
        userEmail: "contact@healthforall.org",
    },
    {
        name: "Literacy for All",
        description:
            "Promoting literacy and education in underserved communities",
        registerationId: "NGO008",
        yearEstablished: 2011,
        contact: {
            email: "contact@literacyforall.org",
            phone: "+91-9876543217",
            website: "",
        },
        otherCauses: "Adult education and skill development",
        userEmail: "contact@literacyforall.org",
    },
];

// Marketplace data exactly from your DonationNeeds files
const marketplaceData = [
    // Food & Nutrition data
    {
        name: "Rice (25kg bags)",
        description:
            "High-quality rice for daily meals for underprivileged families",
        quantity: 50,
        category: "Food & Nutrition",
        urgency: "High",
        location: "Mumbai, Maharashtra",
        ngoName: "Hope Foundation",
        neededTill: new Date("2024-03-25"),
        datePosted: new Date("2024-01-25"),
    },
    {
        name: "Cooking Oil (1L bottles)",
        description:
            "Essential cooking oil for community kitchens and families",
        quantity: 100,
        category: "Food & Nutrition",
        urgency: "Medium",
        location: "Delhi, NCR",
        ngoName: "Care India",
        neededTill: new Date("2024-03-23"),
        datePosted: new Date("2024-01-23"),
    },
    {
        name: "Dal/Lentils (10kg bags)",
        description: "Protein-rich lentils for nutritious meals",
        quantity: 30,
        category: "Food & Nutrition",
        urgency: "High",
        location: "Bangalore, Karnataka",
        ngoName: "Smile Foundation",
        neededTill: new Date("2024-03-20"),
        datePosted: new Date("2024-01-20"),
    },
    {
        name: "Wheat Flour (25kg bags)",
        description: "Fresh wheat flour for bread and meal preparation",
        quantity: 40,
        category: "Food & Nutrition",
        urgency: "Low",
        location: "Hyderabad, Telangana",
        ngoName: "Akshaya Patra",
        neededTill: new Date("2024-03-18"),
        datePosted: new Date("2024-01-18"),
    },

    // Clothing & Apparel data
    {
        name: "Winter Jackets (Adult Size M-L)",
        description: "Warm winter jackets for adult men and women",
        quantity: 25,
        category: "Clothing & Apparel",
        urgency: "High",
        location: "Chennai, Tamil Nadu",
        ngoName: "Clothing the Needy",
        neededTill: new Date("2024-03-26"),
        datePosted: new Date("2024-01-26"),
    },

    // Books & Stationery data
    {
        name: "English Textbooks (Class 6-8)",
        description: "English subject textbooks for middle school students",
        quantity: 150,
        category: "Books & Stationery",
        urgency: "High",
        location: "Kochi, Kerala",
        ngoName: "Literacy for All",
        neededTill: new Date("2024-03-27"),
        datePosted: new Date("2024-01-27"),
    },

    // Medical & Hygiene Supplies data
    {
        name: "First Aid Kits (Complete)",
        description: "Complete first aid kits with essential medical supplies",
        quantity: 30,
        category: "Medical & Hygiene Supplies",
        urgency: "High",
        location: "Nagpur, Maharashtra",
        ngoName: "Health for All Foundation",
        neededTill: new Date("2024-03-28"),
        datePosted: new Date("2024-01-28"),
    },

    // Technology data
    {
        name: "Laptops (Working Condition)",
        description: "Working laptops for digital education",
        quantity: 15,
        category: "Technology",
        urgency: "High",
        location: "Pune, Maharashtra",
        ngoName: "Digital Learning Hub",
        neededTill: new Date("2024-03-29"),
        datePosted: new Date("2024-01-29"),
    },

    // Furniture & Essentials data
    {
        name: "Single Beds with Mattresses",
        description: "Single beds with comfortable mattresses",
        quantity: 12,
        category: "Furniture & Essentials",
        urgency: "High",
        location: "Mumbai, Maharashtra",
        ngoName: "Hope Foundation",
        neededTill: new Date("2024-03-30"),
        datePosted: new Date("2024-01-30"),
    },

    // Toys & Recreation data
    {
        name: "Educational Toys (Age 3-6)",
        description: "Educational toys for early childhood development",
        quantity: 50,
        category: "Toys & Recreation",
        urgency: "High",
        location: "Bangalore, Karnataka",
        ngoName: "Smile Foundation",
        neededTill: new Date("2024-03-31"),
        datePosted: new Date("2024-01-31"),
    },

    // Skill Tools data
    {
        name: "Sewing Machines (Manual & Electric)",
        description: "Manual and electric sewing machines for skill training",
        quantity: 12,
        category: "Skill Tools",
        urgency: "High",
        location: "Delhi, NCR",
        ngoName: "Care India",
        neededTill: new Date("2024-04-01"),
        datePosted: new Date("2024-02-01"),
    },

    // Other Items data
    {
        name: "Umbrellas & Raincoats",
        description: "Umbrellas and raincoats for monsoon season",
        quantity: 100,
        category: "Other Items",
        urgency: "High",
        location: "Kochi, Kerala",
        ngoName: "Literacy for All",
        neededTill: new Date("2024-04-02"),
        datePosted: new Date("2024-02-02"),
    },
];

async function addMarketplaceData(keepConnectionOpen = false) {
    console.log("🚀 Starting marketplace data seeding...");
    try {
        // Connect to MongoDB
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("✅ Connected to MongoDB");
        }

        // Clear existing data EXCEPT the NGOs from step 2
        await User.deleteMany({
            role: { $in: ["ngo"] },
            // Don't delete users created by addNgo.js (they have @example.com emails)
            email: { $not: /@example\.com$/ },
        });
        await NGO.deleteMany({
            // Only delete NGOs that don't have coverImage URLs (i.e., not from step 2)
            $or: [
                { "coverImage.url": "" },
                { "coverImage.url": { $exists: false } },
            ],
        });
        await Marketplace.deleteMany({});
        console.log(
            "🗑️ Cleared existing marketplace data (preserving step 2 NGOs)"
        );

        // Hash password for all users
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("password123", saltRounds);

        // Insert Users first (with hashed passwords)
        const usersWithHashedPasswords = sampleUsers.map((user) => ({
            ...user,
            password: hashedPassword,
        }));

        const insertedUsers = await User.insertMany(usersWithHashedPasswords);
        console.log(`👥 Inserted ${insertedUsers.length} users`);

        // Create a map of user emails to their IDs
        const userMap = {};
        insertedUsers.forEach((user) => {
            userMap[user.email] = user._id;
        });

        // Get all categories to assign to NGOs
        const allCategories = await Category.find({});
        const ngoCategories = allCategories.filter(
            (cat) => cat.type === "ngo" || cat.name === "Education"
        );
        console.log(`📋 Found ${ngoCategories.length} NGO categories`);

        // Prepare NGO data with user IDs and categories
        const ngosWithUserIds = sampleNGOs
            .map((ngo) => {
                const userId = userMap[ngo.userEmail];
                if (!userId) {
                    console.warn(`⚠️ User not found for NGO: ${ngo.name}`);
                    return null;
                }

                return {
                    user: userId,
                    name: ngo.name,
                    description: ngo.description,
                    registerationId: ngo.registerationId,
                    yearEstablished: ngo.yearEstablished,
                    contact: ngo.contact,
                    otherCauses: ngo.otherCauses,
                    category: ngoCategories.slice(0, 2).map((cat) => cat._id), // Assign first 2 categories
                    isVerified: true,
                    isActive: true,
                };
            })
            .filter((ngo) => ngo !== null);

        // Insert NGOs
        const insertedNGOs = await NGO.insertMany(ngosWithUserIds);
        console.log(`🏢 Inserted ${insertedNGOs.length} NGOs`);

        // Create a map of NGO names to their IDs
        const ngoMap = {};
        insertedNGOs.forEach((ngo) => {
            ngoMap[ngo.name] = ngo._id;
        });

        // Prepare marketplace data with NGO IDs
        const marketplaceItemsWithNGOs = marketplaceData
            .map((item) => {
                const ngoId = ngoMap[item.ngoName];
                if (!ngoId) {
                    console.warn(`⚠️ NGO not found for: ${item.ngoName}`);
                    return null;
                }

                return {
                    name: item.name,
                    description: item.description,
                    quantity: item.quantity,
                    category: item.category,
                    neededBy: ngoId,
                    urgency: item.urgency,
                    status: "pending",
                    location: item.location,
                    datePosted: item.datePosted,
                    neededTill: item.neededTill,
                    ngoImage: `/assets/ngo${
                        Math.floor(Math.random() * 5) + 1
                    }.jpg`, // Random NGO image
                };
            })
            .filter((item) => item !== null);

        // Insert marketplace items
        const insertedItems = await Marketplace.insertMany(
            marketplaceItemsWithNGOs
        );
        console.log(`🛒 Inserted ${insertedItems.length} marketplace items`);

        console.log("✅ Marketplace data seeding completed successfully!");

        // Log summary by category
        const summary = {};
        marketplaceItemsWithNGOs.forEach((item) => {
            summary[item.category] = (summary[item.category] || 0) + 1;
        });

        console.log("\n📊 Summary by Category:");
        Object.entries(summary).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} items`);
        });
    } catch (error) {
        console.error("❌ Error seeding marketplace data:", error);
        throw error;
    } finally {
        // Close the connection
        if (!keepConnectionOpen) {
            mongoose.connection.close();
            console.log("🔒 Database connection closed");
        }
    }
}

// Run the seeder if called directly
if (require.main === module) {
    addMarketplaceData();
}

module.exports = { addMarketplaceData };
