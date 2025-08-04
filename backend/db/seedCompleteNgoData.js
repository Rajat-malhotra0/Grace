require("dotenv").config();
const mongoose = require("mongoose");
const Ngo = require("../models/ngo");
const User = require("../models/user");
const Category = require("../models/category");
const connectDB = require("./connect");
const { uploadImage, uploadVideo } = require("../services/imageStoreService");
const path = require("path");

// Complete NGO data from ngoData.js with local file paths
const ngoCompleteData = [
    {
        staticId: "688f22594f1cf4fc90ef4a55",
        name: "Little Lanterns",
        quote: "Love them, lift their world.",
        description:
            "Little Lanterns was born from a simple belief — that every child deserves a gentle light to guide their way through the world. We are not builders of grand monuments, but tender cultivators of small, sacred spaces where children can learn, dream, and heal.",
        registerationId: "LL001",
        yearEstablished: 2015,
        contact: {
            email: "contact@littlelanterns.org",
            phone: "+91-9876543210",
            website: "https://littlelanterns.org",
        },
        otherCauses: "Child education, nutrition, and emotional well-being",
        heroVideoPath: "littleLanterns.mp4",
        coverImagePath: "NgoAssets/ngo1.jpg",
        aboutUs: {
            description:
                "Little Lanterns was born from a simple belief — that every child deserves a gentle light to guide their way through the world. We are not builders of grand monuments, but tender cultivators of small, sacred spaces where children can learn, dream, and heal. Our work flows quietly through rural communities, bringing books where there were none, warmth where winters bite deep, and art where hearts need mending. We believe in the power of quiet presence, of showing up not with loud solutions but with patient hands and listening hearts. We work with children in underserved communities to create safe spaces for learning, expression, and quiet care. Whether it's offering after-school reading corners, warm meals, or simply being a consistent presence, our mission is rooted in showing up gently and often. We understand that true change doesn't always arrive loudly — sometimes, it begins with a story read aloud under dim light, or a child finally asking a question they were once too afraid to voice.",
            imagePath: "NgoAssets/ngo1.jpg",
        },
        projects: [
            {
                id: 1,
                title: "Project Little Lanterns",
                description:
                    "In villages where dusk dims more than the sky, we place books, soft lamps, and hope into the hands of children. This project kindles after-school learning spaces — warm, safe corners where young minds can wonder, read, and dream without darkness closing in.",
                imagePath: "NgoAssets/childrenNature.jpg",
            },
            {
                id: 2,
                title: "Project Warm Threads",
                description:
                    "When winter creeps into tin-roofed homes, we arrive with quiet kindness — hand-stitched sweaters, soft socks, and stories. This project gathers donations and volunteers to wrap vulnerable children in warmth, dignity, and the feeling of being seen and remembered.",
                imagePath: "NgoAssets/childrenNature1.jpg",
            },
            {
                id: 3,
                title: "Project Listen to the Flowers",
                description:
                    "Not all wounds are visible. Through paint, music, and quiet games, this project creates gentle spaces where children can express trauma and joy without judgment. We nurture healing not with loud lessons — but with crayons, drums, open fields, and listening hearts.",
                imagePath: "NgoAssets/children.jpg",
            },
        ],
        volunteer: {
            subheader:
                "Lend your time where small hearts grow — in spaces where kindness becomes their first language.",
            opportunities: [
                {
                    id: 1,
                    title: "Reading Circle Facilitator",
                    description:
                        "Guide children through enchanting stories and help them discover the magic of reading in our after-school programs.",
                    peopleNeeded: "5-8 volunteers",
                    duration: "3 hours/week",
                },
                {
                    id: 2,
                    title: "Art Therapy Assistant",
                    description:
                        "Support children in expressing themselves through creative activities, providing gentle guidance and encouragement.",
                    peopleNeeded: "3-5 volunteers",
                    duration: "4 hours/week",
                },
                {
                    id: 3,
                    title: "Community Outreach Coordinator",
                    description:
                        "Connect with families in remote villages to identify children who could benefit from our programs.",
                    peopleNeeded: "2-3 volunteers",
                    duration: "6 hours/week",
                },
                {
                    id: 4,
                    title: "Meal Preparation Volunteer",
                    description:
                        "Help prepare nutritious meals for children in our care, ensuring they have the energy to learn and grow.",
                    peopleNeeded: "4-6 volunteers",
                    duration: "3 hours/week",
                },
                {
                    id: 5,
                    title: "Educational Material Creator",
                    description:
                        "Design and create learning materials, games, and activities that make education engaging and accessible.",
                    peopleNeeded: "2-4 volunteers",
                    duration: "5 hours/week",
                },
                {
                    id: 6,
                    title: "Mentorship Program Leader",
                    description:
                        "Provide one-on-one guidance and support to children, helping them build confidence and life skills.",
                    peopleNeeded: "6-10 volunteers",
                    duration: "4 hours/week",
                },
            ],
        },
        donate: {
            options: [
                {
                    id: 1,
                    title: "The Need Marketplace",
                    description:
                        "Every item here holds a quiet wish — your gift could be the answer to a quiet ask. A blanket against the cold, a book for growing minds, a meal for tomorrow. In this space, your generosity becomes personal, timely, and deeply human. Come take a stroll with us.",
                    imagePath: "NgoAssets/marketplace.png",
                    buttonText: "Visit Marketplace",
                },
                {
                    id: 2,
                    title: "Support Through Donation",
                    description:
                        "Every contribution, no matter the size, carries quiet power — to reach where you cannot go, to soothe what you may never see. A few rupees here can become warmth, medicine, learning, or clean water elsewhere. Come be part of the difference — from wherever you are.",
                    imagePath: "NgoAssets/donateBanner.png",
                    buttonText: "Donate",
                },
            ],
        },
        mission:
            "Providing gentle spaces for children to learn, dream, and heal",
        volunteersNeeded: 150,
        donationGoal: 25000,
        userEmail: "littlelanterns@grace.org",
        categoryNames: ["Children", "Education"],
    },
    {
        staticId: "688f225a4f1cf4fc90ef4a57",
        name: "Aasha Sapne",
        quote: "Small hearts, wide skies, infinite hope",
        description:
            "Aasha Sapne exists in the space between dreams and reality, where hope takes root in the most unexpected places. We are dreamkeepers and possibility weavers, working with communities to nurture aspirations.",
        registerationId: "AS002",
        yearEstablished: 2018,
        contact: {
            email: "contact@aashasapne.org",
            phone: "+91-9876543211",
            website: "https://aashasapne.org",
        },
        otherCauses:
            "Children's dreams, creative exploration, and emotional support",
        heroVideoPath: "aashaSapne.mp4",
        coverImagePath: "NgoAssets/ngo2.jpg",
        aboutUs: {
            description:
                "Aasha Sapne exists in the space between dreams and reality, where hope takes root in the most unexpected places. We are dreamkeepers and possibility weavers, working with communities to nurture aspirations that seemed too distant to touch. Our approach is gentle yet persistent — we plant seeds of opportunity through education, art, and sustainable practices, then tend to them with patience and care. Aasha Sapne exists for every child who carries hope in one hand and uncertainty in the other. We are a community-led initiative dedicated to nurturing children's dreams through education, creative exploration, and emotional support. Our programs are built around listening — to what each child needs, fears, and longs for. Whether it's helping a girl return to school or guiding a boy through the power of art and imagination, we believe that every dream, no matter how fragile, deserves a place to grow. We believe that every person carries within them a dream worth pursuing, and our role is simply to clear the path and walk alongside them as they journey toward their own light.",
            imagePath: "NgoAssets/ngo2.jpg",
        },
        projects: [
            {
                id: 1,
                title: "Project Moonlight Meals",
                description:
                    "When the sun sets and the world slows down, many small stomachs still rumble in silence. Moonlight Meals ensures that every child ends their day with a warm plate, a full belly, and the quiet comfort of being remembered. It's not just food — it's dignity served gently, under stars.",
                imagePath: "NgoAssets/children1.jpg",
            },
            {
                id: 2,
                title: "Project Paper Wings",
                description:
                    "Some children have never met a library, but they carry questions the size of galaxies. Paper Wings brings mobile book carts and story circles to underserved neighborhoods — turning alleyways into adventures and schoolyards into story havens. Every page turned is a door unlocked.",
                imagePath: "NgoAssets/children2.jpg",
            },
            {
                id: 3,
                title: "Project Quiet Corners",
                description:
                    "For children who've seen more than they should, silence can be both a wound and a refuge. Quiet Corners creates spaces filled with soft rugs, listening ears, art supplies, and time — places where trauma can be named, joy rediscovered, and healing gently begins.",
                imagePath: "NgoAssets/children3.jpg",
            },
        ],
        volunteer: {
            subheader:
                "Join us in weaving dreams into reality, one gentle act at a time.",
            opportunities: [
                {
                    id: 1,
                    title: "Dream Mentor",
                    description:
                        "Work one-on-one with children to help them identify and pursue their aspirations through creative activities.",
                    peopleNeeded: "8-12 volunteers",
                    duration: "4 hours/week",
                },
                {
                    id: 2,
                    title: "Creative Workshop Leader",
                    description:
                        "Lead art, music, and storytelling workshops that allow children to express themselves freely.",
                    peopleNeeded: "6-8 volunteers",
                    duration: "3 hours/week",
                },
            ],
        },
        donate: {
            options: [
                {
                    id: 1,
                    title: "Fund a Dream",
                    description:
                        "Support a child's education, art supplies, or skill development program through direct funding.",
                    imagePath: "NgoAssets/marketplace.png",
                    buttonText: "Fund Dreams",
                },
                {
                    id: 2,
                    title: "Monthly Support",
                    description:
                        "Become a monthly supporter and help us sustain our programs throughout the year.",
                    imagePath: "NgoAssets/donateBanner.png",
                    buttonText: "Support Monthly",
                },
            ],
        },
        mission:
            "Nurturing children's dreams through education and creative expression",
        volunteersNeeded: 100,
        donationGoal: 20000,
        userEmail: "aashasapne@grace.org",
        categoryNames: ["Children", "Education"],
    },
    {
        staticId: "688f225b4f1cf4fc90ef4a59",
        name: "EarthNest",
        quote: "Together, we heal the earth one gentle step at a time.",
        description:
            "EarthNest was founded on the understanding that healing our planet requires the same gentleness we would offer a wounded bird. We work at the intersection of environmental restoration and community empowerment.",
        registerationId: "EN003",
        yearEstablished: 2012,
        contact: {
            email: "contact@earthnest.org",
            phone: "+91-9876543212",
            website: "https://earthnest.org",
        },
        otherCauses:
            "Reforestation, clean water initiatives, and environmental education",
        heroVideoPath: "earthNest.mp4",
        coverImagePath: "NgoAssets/ngo3.jpg",
        aboutUs: {
            description:
                "EarthNest was founded on the understanding that healing our planet requires the same gentleness we would offer a wounded bird. We work at the intersection of environmental restoration and community empowerment, believing that when we heal the earth, we heal ourselves. Our projects span from reforestation efforts to clean water initiatives, always with deep respect for local communities and indigenous wisdom. We understand that environmental healing cannot happen without social healing, and so our work is as much about nurturing human relationships as it is about nurturing the natural world.",
            imagePath: "NgoAssets/ngo3.jpg",
        },
        projects: [
            {
                id: 1,
                title: "Forest Restoration Initiative",
                description:
                    "Working with local communities to restore degraded forest lands through native tree planting and sustainable practices.",
                imagePath: "NgoAssets/nature.jpg",
            },
            {
                id: 2,
                title: "Clean Water Project",
                description:
                    "Installing water purification systems and teaching water conservation practices in rural communities.",
                imagePath: "NgoAssets/nature2.jpg",
            },
            {
                id: 3,
                title: "Environmental Education",
                description:
                    "Teaching children and adults about sustainable living practices and environmental stewardship.",
                imagePath: "NgoAssets/nature3.jpg",
            },
        ],
        volunteer: {
            subheader:
                "Join our mission to create a sustainable future for all living beings.",
            opportunities: [
                {
                    id: 1,
                    title: "Tree Planting Volunteer",
                    description:
                        "Participate in reforestation drives and help plant native trees in degraded areas.",
                    peopleNeeded: "20-30 volunteers",
                    duration: "6 hours/month",
                },
                {
                    id: 2,
                    title: "Environmental Educator",
                    description:
                        "Teach sustainable practices and environmental awareness in schools and communities.",
                    peopleNeeded: "5-10 volunteers",
                    duration: "4 hours/week",
                },
            ],
        },
        donate: {
            options: [
                {
                    id: 1,
                    title: "Plant a Tree",
                    description:
                        "Sponsor tree planting and care activities in our reforestation projects.",
                    imagePath: "NgoAssets/marketplace.png",
                    buttonText: "Plant Trees",
                },
                {
                    id: 2,
                    title: "Clean Water Fund",
                    description:
                        "Support our clean water initiatives and help bring safe drinking water to communities.",
                    imagePath: "NgoAssets/donateBanner.png",
                    buttonText: "Support Water",
                },
            ],
        },
        mission:
            "Creating a sustainable future through environmental restoration and education",
        volunteersNeeded: 200,
        donationGoal: 35000,
        userEmail: "earthnest@grace.org",
        categoryNames: ["Environment", "Rural Development"],
    },
    {
        staticId: "688f225c4f1cf4fc90ef4a5b",
        name: "HerRise",
        quote: "When she rises, communities flourish.",
        description:
            "HerRise stands in the quiet revolution of women supporting women, creating ripples of change that spread far beyond what the eye can see. We believe that when a woman rises, she lifts entire communities with her.",
        registerationId: "HR004",
        yearEstablished: 2016,
        contact: {
            email: "contact@herrise.org",
            phone: "+91-9876543213",
            website: "https://herrise.org",
        },
        otherCauses:
            "Leadership training, microfinance opportunities, and healthcare access",
        heroVideoPath: null, // No video provided in original data
        coverImagePath: "NgoAssets/ngo1.jpg", // Fallback image
        aboutUs: {
            description:
                "HerRise stands in the quiet revolution of women supporting women, creating ripples of change that spread far beyond what the eye can see. We believe that when a woman rises, she lifts entire communities with her. Our programs focus on leadership development, economic empowerment, and healthcare access, always with deep respect for each woman's unique journey and circumstances. We work not as saviors, but as allies, understanding that the greatest transformations happen when women support other women with patience, wisdom, and unwavering belief in each other's potential.",
            imagePath: "NgoAssets/ngo1.jpg",
        },
        projects: [
            {
                id: 1,
                title: "Women Leadership Program",
                description:
                    "Empowering women with leadership skills and confidence to take on community roles.",
                imagePath: "NgoAssets/children.jpg", // Using available image
            },
            {
                id: 2,
                title: "Microfinance Initiative",
                description:
                    "Providing small loans and financial literacy training to help women start their own businesses.",
                imagePath: "NgoAssets/children1.jpg",
            },
            {
                id: 3,
                title: "Healthcare Access Program",
                description:
                    "Mobile health clinics and awareness campaigns focused on women's health and wellness.",
                imagePath: "NgoAssets/children2.jpg",
            },
        ],
        volunteer: {
            subheader:
                "Join us in empowering women to create lasting change in their communities.",
            opportunities: [
                {
                    id: 1,
                    title: "Mentorship Coordinator",
                    description:
                        "Support women in developing leadership skills and achieving their personal goals.",
                    peopleNeeded: "10-15 volunteers",
                    duration: "5 hours/week",
                },
                {
                    id: 2,
                    title: "Financial Literacy Trainer",
                    description:
                        "Teach basic financial management and business skills to women entrepreneurs.",
                    peopleNeeded: "5-8 volunteers",
                    duration: "3 hours/week",
                },
            ],
        },
        donate: {
            options: [
                {
                    id: 1,
                    title: "Empower Women",
                    description:
                        "Fund leadership training programs and skill development workshops for women.",
                    imagePath: "NgoAssets/marketplace.png",
                    buttonText: "Empower",
                },
                {
                    id: 2,
                    title: "Support Healthcare",
                    description:
                        "Help provide healthcare access and awareness programs for women in rural areas.",
                    imagePath: "NgoAssets/donateBanner.png",
                    buttonText: "Support Health",
                },
            ],
        },
        mission:
            "Empowering women to create positive change in their communities",
        volunteersNeeded: 80,
        donationGoal: 30000,
        userEmail: "herrise@grace.org",
        categoryNames: ["Women Empowerment", "Health"],
    },
    {
        staticId: "688f225d4f1cf4fc90ef4a5d",
        name: "Healthfirst Initiative",
        quote: "Healing hearts, saving lives, spreading hope across communities.",
        description:
            "Healthfirst Initiative emerged from the belief that healthcare is not just about treating illness, but about nurturing the wholeness of human beings. We bring medical care to communities where geography and poverty have created barriers to healing.",
        registerationId: "HI005",
        yearEstablished: 2014,
        contact: {
            email: "contact@healthfirst.org",
            phone: "+91-9876543214",
            website: "https://healthfirst.org",
        },
        otherCauses:
            "Mobile clinics, community health programs, and emergency response",
        heroVideoPath: null, // Using external URL in original data
        coverImagePath: "NgoAssets/ngo2.jpg",
        aboutUs: {
            description:
                "Healthfirst Initiative emerged from the belief that healthcare is not just about treating illness, but about nurturing the wholeness of human beings. We bring medical care to communities where geography and poverty have created barriers to healing, but we also bring something more — presence, dignity, and hope. Our mobile clinics and community health programs are designed around the understanding that true healing happens when people feel seen, valued, and cared for. We work not as saviors, but as partners in health, recognizing the strength and wisdom that exists within every community we serve.",
            imagePath: "NgoAssets/ngo2.jpg",
        },
        projects: [
            {
                id: 1,
                title: "Mobile Health Clinics",
                description:
                    "Bringing medical care directly to remote communities through fully equipped mobile units.",
                imagePath: "NgoAssets/children3.jpg",
            },
            {
                id: 2,
                title: "Mental Health Support",
                description:
                    "Counseling services and mental health awareness programs for underserved populations.",
                imagePath: "NgoAssets/nature.jpg",
            },
            {
                id: 3,
                title: "Emergency Response Team",
                description:
                    "Rapid response medical teams for disaster relief and emergency healthcare situations.",
                imagePath: "NgoAssets/nature2.jpg",
            },
        ],
        volunteer: {
            subheader:
                "Join our healthcare mission to bring healing and hope to underserved communities.",
            opportunities: [
                {
                    id: 1,
                    title: "Medical Volunteer",
                    description:
                        "Provide medical care and support in our mobile clinics and health camps.",
                    peopleNeeded: "15-20 volunteers",
                    duration: "8 hours/month",
                },
                {
                    id: 2,
                    title: "Health Educator",
                    description:
                        "Conduct health awareness programs and preventive care education in communities.",
                    peopleNeeded: "10-12 volunteers",
                    duration: "4 hours/week",
                },
            ],
        },
        donate: {
            options: [
                {
                    id: 1,
                    title: "Medical Equipment",
                    description:
                        "Help us purchase essential medical equipment for our mobile clinics.",
                    imagePath: "NgoAssets/marketplace.png",
                    buttonText: "Donate Equipment",
                },
                {
                    id: 2,
                    title: "Healthcare Fund",
                    description:
                        "Support our ongoing healthcare programs and emergency response initiatives.",
                    imagePath: "NgoAssets/donateBanner.png",
                    buttonText: "Support Healthcare",
                },
            ],
        },
        mission:
            "Providing accessible healthcare services to underserved communities",
        volunteersNeeded: 120,
        donationGoal: 40000,
        userEmail: "healthfirst@grace.org",
        categoryNames: ["Health", "Rural Development"],
    },
    {
        staticId: "688f225e4f1cf4fc90ef4a5f",
        name: "Learning Bridge",
        quote: "Every child's smile is a promise of a better world.",
        description:
            "Learning Bridge exists in the space where curiosity meets possibility, where a child's natural wonder is honored and nurtured. We believe that education is not about filling empty vessels, but about kindling flames that already burn within young hearts.",
        registerationId: "LB006",
        yearEstablished: 2017,
        contact: {
            email: "contact@learningbridge.org",
            phone: "+91-9876543215",
            website: "https://learningbridge.org",
        },
        otherCauses: "Mobile libraries, STEM education, and teacher training",
        heroVideoPath: null, // Using external URL in original data
        coverImagePath: "NgoAssets/ngo3.jpg",
        aboutUs: {
            description:
                "Learning Bridge exists in the space where curiosity meets possibility, where a child's natural wonder is honored and nurtured. We believe that education is not about filling empty vessels, but about kindling flames that already burn within young hearts. Our programs — from mobile libraries to STEM education — are designed to meet children where they are, with respect for their innate wisdom and boundless potential. We work in partnership with communities, understanding that the most powerful learning happens when children feel safe, valued, and free to explore the world with joy and wonder.",
            imagePath: "NgoAssets/ngo3.jpg",
        },
        projects: [
            {
                id: 1,
                title: "Library on Wheels",
                description:
                    "Mobile libraries bringing books and reading programs to children in remote villages.",
                imagePath: "NgoAssets/nature3.jpg",
            },
            {
                id: 2,
                title: "STEM Education Program",
                description:
                    "Hands-on science, technology, engineering, and math programs for young learners.",
                imagePath: "NgoAssets/childrenNature.jpg",
            },
            {
                id: 3,
                title: "Teacher Training Initiative",
                description:
                    "Professional development programs to enhance teaching quality in underserved schools.",
                imagePath: "NgoAssets/childrenNature1.jpg",
            },
        ],
        volunteer: {
            subheader:
                "Help us bridge the gap between curiosity and learning for every child.",
            opportunities: [
                {
                    id: 1,
                    title: "Mobile Library Assistant",
                    description:
                        "Help operate our mobile libraries and conduct reading sessions with children.",
                    peopleNeeded: "12-15 volunteers",
                    duration: "5 hours/week",
                },
                {
                    id: 2,
                    title: "STEM Workshop Leader",
                    description:
                        "Lead hands-on science and technology workshops for children in rural schools.",
                    peopleNeeded: "8-10 volunteers",
                    duration: "6 hours/week",
                },
            ],
        },
        donate: {
            options: [
                {
                    id: 1,
                    title: "Fund Education",
                    description:
                        "Support our educational programs and provide learning materials for children.",
                    imagePath: "NgoAssets/marketplace.png",
                    buttonText: "Fund Learning",
                },
                {
                    id: 2,
                    title: "Support Libraries",
                    description:
                        "Help us expand our mobile library program and bring books to more children.",
                    imagePath: "NgoAssets/donateBanner.png",
                    buttonText: "Support Libraries",
                },
            ],
        },
        mission:
            "Bridging educational gaps through innovative learning programs",
        volunteersNeeded: 90,
        donationGoal: 28000,
        userEmail: "learningbridge@grace.org",
        categoryNames: ["Education", "Children"],
    },
];

// Sample users for NGOs
const ngoUsers = [
    {
        userName: "littlelanterns",
        email: "littlelanterns@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Mumbai", state: "Maharashtra" },
    },
    {
        userName: "aashasapne",
        email: "aashasapne@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Delhi", state: "Delhi" },
    },
    {
        userName: "earthnest",
        email: "earthnest@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Bangalore", state: "Karnataka" },
    },
    {
        userName: "herrise",
        email: "herrise@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Pune", state: "Maharashtra" },
    },
    {
        userName: "healthfirst",
        email: "healthfirst@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Chennai", state: "Tamil Nadu" },
    },
    {
        userName: "learningbridge",
        email: "learningbridge@grace.org",
        password: "password123",
        role: ["ngo"],
        location: { city: "Kolkata", state: "West Bengal" },
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
        return {
            url: result.url,
            publicId: result.publicId,
            alt: `${imagePath} - NGO image`,
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

// Helper function to upload video to Cloudinary
async function uploadVideoToCloudinary(videoPath) {
    try {
        const fullPath = path.join(
            __dirname,
            "../../frontend/src/assets",
            videoPath
        );
        const result = await uploadVideo(fullPath, "grace-videos");
        console.log(`🎥 Uploaded ${videoPath} to Cloudinary`);
        return result.url;
    } catch (error) {
        console.error(`❌ Error uploading video ${videoPath}:`, error.message);
        return ""; // Return empty string on error
    }
}

async function seedCompleteNgoData(keepConnectionOpen = false) {
    try {
        // Only connect if connection is not already established
        if (!keepConnectionOpen && mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("Connected to MongoDB");
        }

        // Clear existing NGO data
        await Ngo.deleteMany({});
        console.log("🗑️ Cleared existing NGO data");

        // Get all categories
        const categories = await Category.find({});
        const categoryMap = {};
        categories.forEach((cat) => {
            categoryMap[cat.name] = cat._id;
        });
        console.log("📋 Retrieved categories:", Object.keys(categoryMap));

        // Create users first (if they don't exist)
        const userMap = {};
        for (const userData of ngoUsers) {
            let user = await User.findOne({
                $or: [
                    { email: userData.email },
                    { userName: userData.userName },
                ],
            });
            if (!user) {
                user = new User(userData);
                await user.save();
                console.log(`👤 Created user: ${userData.email}`);
            } else {
                console.log(`👤 Found existing user: ${user.email}`);
            }
            userMap[userData.email] = user._id;
        }

        // Process each NGO
        for (const ngoData of ngoCompleteData) {
            console.log(`\n🏢 Processing ${ngoData.name}...`);

            const userId = userMap[ngoData.userEmail];
            if (!userId) {
                console.warn(`⚠️ User not found for: ${ngoData.userEmail}`);
                continue;
            }

            // Get category IDs
            const categoryIds = ngoData.categoryNames
                .map((name) => categoryMap[name])
                .filter((id) => id);

            if (categoryIds.length === 0) {
                console.warn(`⚠️ No categories found for: ${ngoData.name}`);
                continue;
            }

            // Upload hero video if available
            let heroVideoUrl = "";
            if (ngoData.heroVideoPath) {
                heroVideoUrl = await uploadVideoToCloudinary(
                    ngoData.heroVideoPath
                );
            }

            // Upload cover image
            const coverImage = await uploadImageToCloudinary(
                ngoData.coverImagePath
            );

            // Upload about us image
            const aboutUsImage = await uploadImageToCloudinary(
                ngoData.aboutUs.imagePath
            );

            // Upload project images
            const projects = [];
            for (const project of ngoData.projects) {
                const projectImage = await uploadImageToCloudinary(
                    project.imagePath
                );
                projects.push({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    image: projectImage.url,
                });
            }

            // Upload donate option images
            const donateOptions = [];
            for (const option of ngoData.donate.options) {
                const optionImage = await uploadImageToCloudinary(
                    option.imagePath
                );
                donateOptions.push({
                    id: option.id,
                    title: option.title,
                    description: option.description,
                    image: optionImage.url,
                    buttonText: option.buttonText,
                });
            }

            // Create NGO with all data
            const ngo = new Ngo({
                _id: new mongoose.Types.ObjectId(ngoData.staticId),
                user: userId,
                name: ngoData.name,
                quote: ngoData.quote,
                description: ngoData.description,
                registerationId: ngoData.registerationId,
                yearEstablished: ngoData.yearEstablished,
                contact: ngoData.contact,
                otherCauses: ngoData.otherCauses,
                coverImage: coverImage,
                heroVideo: heroVideoUrl,
                aboutUs: {
                    description: ngoData.aboutUs.description,
                    image: aboutUsImage.url,
                },
                projects: projects,
                volunteer: ngoData.volunteer,
                donate: {
                    options: donateOptions,
                },
                mission: ngoData.mission,
                volunteersNeeded: ngoData.volunteersNeeded,
                donationGoal: ngoData.donationGoal,
                category: categoryIds,
                isVerified: true,
                isActive: true,
            });

            await ngo.save();
            console.log(
                `✅ Successfully created ${ngoData.name} with ID: ${ngo._id}`
            );
        }

        // Verify the data
        const insertedNgos = await Ngo.find({})
            .populate("category", "name")
            .populate("user", "userName email");

        console.log(`\n🎉 Successfully inserted ${insertedNgos.length} NGOs`);
        console.log("\n=== INSERTED NGOs ===");
        insertedNgos.forEach((ngo) => {
            console.log(`ID: ${ngo._id}`);
            console.log(`Name: ${ngo.name}`);
            console.log(`User: ${ngo.user.userName} (${ngo.user.email})`);
            console.log(
                `Categories: ${ngo.category.map((cat) => cat.name).join(", ")}`
            );
            console.log(`Hero Video: ${ngo.heroVideo ? "Yes" : "No"}`);
            console.log(`Projects: ${ngo.projects.length}`);
            console.log(
                `Volunteer Opportunities: ${ngo.volunteer.opportunities.length}`
            );
            console.log("---");
        });

        // Only close connection if we opened it
        if (!keepConnectionOpen && mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("🔐 Database connection closed");
        }
    } catch (error) {
        console.error("💥 Error seeding complete NGO data:", error);
        if (!keepConnectionOpen && mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        throw error;
    }
}

// Run the seeding function only if this file is executed directly
if (require.main === module) {
    seedCompleteNgoData()
        .then(() => {
            console.log("✅ Complete NGO seeding finished successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Complete NGO seeding failed:", error);
            process.exit(1);
        });
}

module.exports = { seedCompleteNgoData };
