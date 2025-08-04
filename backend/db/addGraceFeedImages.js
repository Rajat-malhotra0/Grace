const mongoose = require("mongoose");
const GraceFeed = require("../models/Gracefeed");
const User = require("../models/user");
const connectDB = require("./connect");

// Dynamic feed data generation for all 24 images
const feedCaptions = [
    "Breaking barriers and building bridges! 🌉 #BreakingBarriers #BuildingBridges",
    "Creating lasting impact in communities! 🏠 #CommunityImpact #Lasting",
    "Empowering through education and skills! 📚 #Education #Skills #Empowerment",
    "Together we can change the world! 🌍 #ChangeTheWorld #Together",
    "Supporting sustainable development goals! 🌱 #SDG #Sustainability",
    "Building stronger communities together! 💪 #StrongerCommunities #Building",
    "Inspiring hope and positive change! ✨ #Hope #PositiveChange #Inspiring",
    "Making a difference one step at a time! 👣 #MakingDifference #OneStep",
    "Connecting hearts and minds for good! ❤️ #Connecting #Hearts #Minds",
    "Transforming lives through compassion! 🤗 #TransformingLives #Compassion",
    "Spreading kindness and love everywhere! 💕 #Kindness #Love #Spreading",
    "Empowering women and girls globally! 👩 #WomenEmpowerment #Girls #Global",
    "Creating opportunities for everyone! 🌈 #Opportunities #Everyone #Creating",
    "Building a better future together! 🏗️ #BetterFuture #Building #Together",
    "Fighting poverty through innovation! 💡 #FightingPoverty #Innovation",
    "Promoting health and wellness for all! 🏥 #Health #Wellness #Promoting",
    "Supporting education for every child! 🎓 #Education #Child #Supporting",
    "Protecting our environment for future generations! 🌳 #Environment #Protection",
    "Advocating for human rights everywhere! ⚖️ #HumanRights #Advocating",
    "Fostering innovation through education! 💡 #Innovation #Education #Foster",
    "Unity in diversity makes us stronger! 🤝 #Unity #Diversity #Stronger",
    "Empowering communities through education! 📚 #Empowerment #Education #Community",
    "Together we can make a difference! 🌍 #Together #Difference #Make",
    "Empowering youth for a brighter future! 🌞 #YouthEmpowerment #Future",
];

const feedTags = [
    ["barrier", "bridge", "breaking"],
    ["community", "impact", "lasting"],
    ["education", "skills", "empowerment"],
    ["change", "world", "together"],
    ["sdg", "sustainability", "development"],
    ["community", "strength", "building"],
    ["hope", "change", "positive"],
    ["difference", "step", "making"],
    ["connecting", "hearts", "minds"],
    ["transforming", "lives", "compassion"],
    ["kindness", "love", "spreading"],
    ["women", "empowerment", "girls"],
    ["opportunities", "everyone", "creating"],
    ["future", "building", "together"],
    ["poverty", "fighting", "innovation"],
    ["health", "wellness", "promoting"],
    ["education", "child", "supporting"],
    ["environment", "protection", "future"],
    ["human", "rights", "advocating"],
    ["innovation", "education", "foster"],
    ["unity", "diversity", "stronger"],
    ["empowerment", "education", "community"],
    ["together", "difference", "make"],
    ["youth", "empowerment", "future"],
];

const sizes = ["small", "medium", "large"];

// Dynamically generate all 24 feed entries
const FeedData = Array.from({ length: 24 }, (_, index) => ({
    content: `img${index + 1}.jpg`,
    type: "photo",
    caption: feedCaptions[index],
    size: sizes[index % sizes.length], // Rotate through sizes
    tags: feedTags[index],
    isActive: true,
}));

async function addGraceFeedImages() {
    try {
        await connectDB();

        // Get a default user to assign posts to
        let defaultUser = await User.findOne({ role: { $in: ["admin"] } });

        if (!defaultUser) {
            // Create a default user if none exists
            defaultUser = new User({
                userName: "graceadmin",
                email: "admin@grace.com",
                password: "admin123", // This should be hashed in production
                role: ["admin"],
                termsAccepted: true,
            });
            await defaultUser.save();
            console.log("Default admin user created");
        }

        // Clear existing feed posts to avoid duplicates
        await GraceFeed.deleteMany({});
        console.log("Cleared existing Grace feed posts");

        // Add the new feed posts with dynamic data
        const feedPosts = FeedData.map((post) => ({
            ...post,
            user: defaultUser._id,
            createdAt: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ), // Random dates within last 30 days
        }));

        const savedPosts = await GraceFeed.insertMany(feedPosts);
        console.log(
            `Successfully added ${savedPosts.length} Grace feed images dynamically!`
        );
        console.log("Dynamic generation completed - all 24 images processed!");

        // Log first few entries to verify
        savedPosts.slice(0, 3).forEach((post, index) => {
            console.log(
                `Post ${index + 1}: ${post.content} - "${post.caption}"`
            );
        });

        process.exit(0);
    } catch (error) {
        console.error("Error adding Grace feed images:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    addGraceFeedImages();
}

module.exports = addGraceFeedImages;
