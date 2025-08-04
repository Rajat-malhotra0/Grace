//We will be adding/modifying impact stories in this file, stored in the db . 

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
        {
            title: "Digital Skills for Rural Women",
            content: "Rural women learned computer skills and digital literacy, enabling them to start online businesses and increase their income. 200 women have been trained, with 80% starting their own micro-enterprises.",
            category: "Education",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Feeding the Hungry",
            content: "Daily meal distribution program serves nutritious food to underprivileged children and elderly. Over 500 meals are distributed daily, ensuring no one goes hungry in the community.",
            category: "Food Security",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Mental Health Awareness Campaign",
            content: "Community workshops on mental health awareness helped remove stigma and provide support to those in need. 1,000+ people attended sessions, with 100 receiving ongoing counseling support.",
            category: "Healthcare",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Elderly Care Program",
            content: "Volunteers provide companionship and assistance to elderly citizens living alone. 150 elderly people receive regular visits, medical assistance, and emotional support through our program.",
            category: "Social Welfare",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Skill Development for Youth",
            content: "Vocational training programs helped unemployed youth develop marketable skills. 300 young people have been trained in various trades, with 85% finding employment or starting businesses.",
            category: "Employment",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Books for Rural Schools",
            content: "Mobile library initiative brings books and educational resources to remote schools. 25 schools now have access to 10,000+ books, improving literacy rates by 40%.",
            category: "Education",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
        {
            title: "Solar Power for Villages",
            content: "Solar panel installation project brought electricity to remote villages for the first time. 5 villages now have clean energy, enabling children to study after dark and adults to pursue evening activities.",
            category: "Energy",
            createdBy: new mongoose.Types.ObjectId(),
            relatedTask: [],
        },
    ];

    try {
        await ImpactStory.deleteMany({});
        const result = await ImpactStory.insertMany(sampleStories);
        console.log(`Inserted ${result.length} impact stories.`);
        return true;
    } catch (err) {
        console.error("Error seeding impact stories:", err);
        return false;
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
}

// Export the function for use in other files
module.exports = { seedImpactStories };

// If this file is run directly, execute the function
if (require.main === module) {
    seedImpactStories();
}