const mongoose = require("mongoose");
const GraceFeed = require("../models/Gracefeed");
const User = require("../models/user");
const connectDB = require("./connect");

// Sample posts data
const samplePosts = [
    {
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=400&fit=crop",
        caption:
            "Today we helped build homes for families in need. Every nail hammered with love! 🏠💕",
        tags: ["construction", "housing", "community"],
    },
    {
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop",
        caption:
            "Teaching art therapy to children at the community center ✨🎨",
        tags: ["art", "therapy", "children"],
    },
    {
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=350&fit=crop",
        caption:
            "Reading stories to kids at the local library. Books open minds! ☀️📚",
        tags: ["education", "reading", "children"],
    },
    {
        type: "text",
        content:
            "Grateful for all the amazing volunteers who showed up today for the community garden project! Together we planted over 200 seedlings that will feed families this summer. 🌱🥕",
        caption: "",
        tags: ["gardening", "community", "food security"],
    },
    {
        type: "photo",
        content:
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&h=400&fit=crop",
        caption:
            "Medical camp in the village reached 150 families today. Healthcare is a basic right! �❤️",
        tags: ["healthcare", "rural", "medical"],
    },
];

async function addFeedContent(keepConnectionOpen = false) {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("🔗 Connected to MongoDB for feed content seeding");
        }

        // Clear existing feed data
        await GraceFeed.deleteMany({});
        console.log("🧹 Cleared existing feed content");

        // Get existing users to create posts
        const users = await User.find({
            role: { $in: ["volunteer", "ngoMember"] },
        }).limit(5);

        if (users.length === 0) {
            console.log("⚠️  No users found. Please seed users first.");
            return;
        }

        // Create posts with user references
        const postsWithUsers = samplePosts.map((post, index) => ({
            ...post,
            user: users[index % users.length]._id,
            likes: [],
            comments: [],
            shares: [],
        }));

        const createdPosts = await GraceFeed.insertMany(postsWithUsers);
        console.log(`✅ Created ${createdPosts.length} feed posts`);

        console.log("📱 Sample Feed Posts:");
        createdPosts.forEach((post, index) => {
            const user = users[index % users.length];
            console.log(
                `   • ${user.userName}: ${
                    post.type
                } - "${post.caption.substring(0, 50)}..."`
            );
        });

        if (!keepConnectionOpen) {
            await mongoose.connection.close();
            console.log("🔒 Database connection closed");
        }

        return createdPosts;
    } catch (error) {
        console.error("❌ Error seeding feed content:", error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    addFeedContent()
        .then(() => {
            console.log("🏁 Feed content seeding completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Feed content seeding failed:", error);
            process.exit(1);
        });
}

module.exports = { addFeedContent };
