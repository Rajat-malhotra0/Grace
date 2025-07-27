// backend/db/addImpactStories.js

const mongoose = require("mongoose");
const ImpactStory = require("../models/impactStory");
const connectDB = require("./connect"); // assumes connect.js exports a function to connect

async function seedImpactStories() {
    await connectDB();

    const sampleStories = [
        {
            title: "A New Beginning for Stray Dogs",
            content: "Volunteers rescued and cared for stray dogs, giving them a loving home and a second chance at life.",
            category: "Animal Welfare",
            createdBy: new mongoose.Types.ObjectId(), // Replace with actual user IDs if needed
            relatedTask: [],
        },
        {
            title: "Clean Water for All",
            content: "A community well was built, providing clean water and improving health for hundreds of villagers.",
            category: "Community",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Greener Tomorrow",
            content: "Children planted trees in their neighborhood, making the environment cleaner and inspiring others to join.",
            category: "Environment",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
    ];

    try {
        await ImpactStory.deleteMany({});
        const result = await ImpactStory.insertMany(sampleStories);
        console.log(`Inserted ${result.length} impact stories.`);
    } catch (err) {
        console.error("Error seeding impact stories:", err);
    } finally {
        mongoose.connection.close();
    }
}

seedImpactStories();