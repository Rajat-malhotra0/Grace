const mongoose = require("mongoose");
const ImpactStory = require("../models/impactStory");
const Task = require("../models/task");
const User = require("../models/user");
const connectDB = require("./connect");

const sampleStories = [
    {
        title: "Building Hope for Underprivileged Children",
        content:
            "Through our reading circle initiative, we've seen remarkable transformation in children's literacy levels. Maria, age 8, went from struggling with basic words to reading entire story books. Her confidence has soared, and she now helps other children during reading sessions. This is the power of dedicated volunteers and community support.",
        category: "Education",
    },
    {
        title: "Healing Through Art Therapy",
        content:
            "Our art therapy program has touched the lives of 45 children dealing with trauma. Through colors, shapes, and creative expression, they've found ways to communicate their feelings and begin healing. One child, who hadn't spoken in months, started expressing himself through beautiful paintings and slowly began to open up.",
        category: "Children",
    },
    {
        title: "Community Garden Transforms Neighborhood",
        content:
            "What started as an empty lot filled with debris is now a thriving community garden feeding 20 families. Volunteers worked tirelessly to clear the land, plant vegetables, and create a sustainable food source. The garden has not only provided fresh produce but also brought the community closer together.",
        category: "Environment",
    },
    {
        title: "Women's Empowerment Through Skill Training",
        content:
            "Reshma learned tailoring through our vocational training program and now runs her own small business. She employs 3 other women from her community and has tripled her family's income. Her success story has inspired 15 more women to join our next training batch.",
        category: "Women Empowerment",
    },
    {
        title: "Mobile Health Camp Saves Lives",
        content:
            "Our mobile health camp reached a remote village where medical facilities were non-existent. We provided free health checkups to 200+ villagers and identified critical health conditions in 12 patients who were immediately referred for treatment. Two lives were saved that day thanks to early detection.",
        category: "Health",
    },
];

async function addImpactStories(keepConnectionOpen = false) {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("🔗 Connected to MongoDB for impact stories seeding");
        }

        // Clear existing impact stories
        await ImpactStory.deleteMany({});
        console.log("🗑️ Cleared existing impact stories");

        // Get users to assign as story creators
        const users = await User.find({
            role: { $in: ["volunteer", "ngoMember"] },
        }).limit(5);

        if (users.length === 0) {
            console.log("⚠️  No users found. Please seed users first.");
            return;
        }

        // Get some completed tasks to link to stories
        const completedTasks = await Task.find({ status: "done" }).limit(10);

        // Create stories with user references and optional task links
        const storiesWithRefs = sampleStories.map((story, index) => ({
            ...story,
            createdBy: users[index % users.length]._id,
            relatedTask:
                completedTasks.length > 0
                    ? [completedTasks[index % completedTasks.length]._id]
                    : [],
        }));

        const createdStories = await ImpactStory.insertMany(storiesWithRefs);
        console.log(`✅ Created ${createdStories.length} impact stories`);

        console.log("📖 Sample Impact Stories:");
        createdStories.forEach((story, index) => {
            const user = users[index % users.length];
            console.log(
                `   • "${story.title}" by ${user.userName} (${story.category})`
            );
        });

        if (!keepConnectionOpen) {
            await mongoose.connection.close();
            console.log("🔒 Database connection closed");
        }

        return createdStories;
    } catch (error) {
        console.error("❌ Error seeding impact stories:", error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    addImpactStories()
        .then(() => {
            console.log("🏁 Impact stories seeding completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Impact stories seeding failed:", error);
            process.exit(1);
        });
}

module.exports = { addImpactStories };
