const mongoose = require("mongoose");
const Task = require("../models/task");
const User = require("../models/user");
const Ngo = require("../models/ngo");
const Category = require("../models/category");
const connectDB = require("./connect");

// Task templates for different NGO categories
const taskTemplates = {
    Children: [
        {
            title: "Organize Reading Circle for Kids",
            description:
                "Set up and facilitate a reading circle for children aged 6-12. Select age-appropriate books and encourage active participation.",
            priority: "high",
            estimatedMinutes: 120,
            tags: ["education", "reading", "children", "literacy"],
        },
        {
            title: "Prepare Art Supplies for Therapy Session",
            description:
                "Organize and prepare art materials for upcoming art therapy sessions. Ensure all supplies are child-safe and adequate.",
            priority: "medium",
            estimatedMinutes: 60,
            tags: ["art", "therapy", "preparation", "children"],
        },
        {
            title: "Coordinate Meal Distribution",
            description:
                "Oversee the preparation and distribution of nutritious meals to children in the program.",
            priority: "high",
            estimatedMinutes: 90,
            tags: ["nutrition", "meal", "distribution", "health"],
        },
        {
            title: "Plan Educational Activity Session",
            description:
                "Design and plan engaging educational activities that promote learning and development.",
            priority: "medium",
            estimatedMinutes: 75,
            tags: ["education", "planning", "activities", "development"],
        },
        {
            title: "Conduct Safety Check of Play Area",
            description:
                "Inspect and ensure the safety of all play equipment and recreational areas.",
            priority: "high",
            estimatedMinutes: 45,
            tags: ["safety", "inspection", "playground", "maintenance"],
        },
        {
            title: "Create Learning Materials",
            description:
                "Develop creative learning materials and games that support children's educational growth.",
            priority: "low",
            estimatedMinutes: 100,
            tags: ["materials", "creativity", "learning", "development"],
        },
    ],
    Environment: [
        {
            title: "Plant Saplings in Community Garden",
            description:
                "Plant and care for new saplings in the community garden area. Include proper watering and initial care instructions.",
            priority: "high",
            estimatedMinutes: 150,
            tags: ["planting", "garden", "saplings", "green"],
        },
        {
            title: "Organize Waste Segregation Drive",
            description:
                "Coordinate waste segregation activities in the local community and educate residents about proper disposal.",
            priority: "medium",
            estimatedMinutes: 120,
            tags: ["waste", "segregation", "community", "awareness"],
        },
        {
            title: "Conduct Water Quality Testing",
            description:
                "Test and monitor water quality in local water bodies and document findings for environmental reports.",
            priority: "high",
            estimatedMinutes: 90,
            tags: ["water", "testing", "quality", "monitoring"],
        },
        {
            title: "Lead Nature Walk and Education",
            description:
                "Guide community members on nature walks while providing environmental education and awareness.",
            priority: "medium",
            estimatedMinutes: 180,
            tags: ["nature", "education", "awareness", "walk"],
        },
        {
            title: "Maintain Composting Station",
            description:
                "Monitor and maintain the community composting station, ensuring proper decomposition processes.",
            priority: "low",
            estimatedMinutes: 60,
            tags: ["composting", "maintenance", "organic", "waste"],
        },
        {
            title: "Document Wildlife Conservation",
            description:
                "Record and document local wildlife species and their habitats for conservation research.",
            priority: "medium",
            estimatedMinutes: 110,
            tags: ["wildlife", "documentation", "conservation", "research"],
        },
    ],
    "Women Empowerment": [
        {
            title: "Facilitate Skill Development Workshop",
            description:
                "Conduct skills training workshops for women in vocational trades like tailoring, handicrafts, or digital literacy.",
            priority: "high",
            estimatedMinutes: 180,
            tags: ["skills", "workshop", "vocational", "training"],
        },
        {
            title: "Provide Legal Counseling Session",
            description:
                "Offer legal guidance and counseling to women facing legal issues or seeking advice on their rights.",
            priority: "high",
            estimatedMinutes: 120,
            tags: ["legal", "counseling", "rights", "advice"],
        },
        {
            title: "Organize Self-Defense Training",
            description:
                "Coordinate self-defense training sessions to empower women with personal safety skills.",
            priority: "medium",
            estimatedMinutes: 90,
            tags: ["self-defense", "safety", "training", "empowerment"],
        },
        {
            title: "Conduct Financial Literacy Program",
            description:
                "Teach basic financial management, savings, and investment concepts to help women achieve financial independence.",
            priority: "medium",
            estimatedMinutes: 100,
            tags: ["financial", "literacy", "savings", "independence"],
        },
        {
            title: "Mentor Women Entrepreneurs",
            description:
                "Provide one-on-one mentoring to women starting their own businesses or entrepreneurial ventures.",
            priority: "low",
            estimatedMinutes: 150,
            tags: ["mentoring", "entrepreneurship", "business", "guidance"],
        },
        {
            title: "Create Awareness Campaign",
            description:
                "Develop and implement awareness campaigns about women's rights and available support services.",
            priority: "medium",
            estimatedMinutes: 80,
            tags: ["awareness", "campaign", "rights", "outreach"],
        },
    ],
    Health: [
        {
            title: "Conduct Health Screening Camp",
            description:
                "Organize and assist in community health screening camps for early detection of health issues.",
            priority: "high",
            estimatedMinutes: 240,
            tags: ["health", "screening", "camp", "prevention"],
        },
        {
            title: "Distribute Medical Supplies",
            description:
                "Organize and distribute essential medical supplies and medications to underserved communities.",
            priority: "high",
            estimatedMinutes: 90,
            tags: ["medical", "supplies", "distribution", "healthcare"],
        },
        {
            title: "Educate on Hygiene Practices",
            description:
                "Conduct educational sessions on proper hygiene practices and disease prevention methods.",
            priority: "medium",
            estimatedMinutes: 75,
            tags: ["hygiene", "education", "prevention", "awareness"],
        },
        {
            title: "Assist in Vaccination Drive",
            description:
                "Support healthcare workers in organizing and conducting vaccination drives in rural areas.",
            priority: "high",
            estimatedMinutes: 180,
            tags: ["vaccination", "healthcare", "rural", "prevention"],
        },
        {
            title: "Maintain Medical Equipment",
            description:
                "Check, clean, and maintain medical equipment and ensure proper storage of supplies.",
            priority: "medium",
            estimatedMinutes: 60,
            tags: ["equipment", "maintenance", "medical", "storage"],
        },
        {
            title: "Provide First Aid Training",
            description:
                "Train community members in basic first aid techniques and emergency response procedures.",
            priority: "low",
            estimatedMinutes: 120,
            tags: ["first-aid", "training", "emergency", "community"],
        },
    ],
    Education: [
        {
            title: "Teach Basic Computer Skills",
            description:
                "Provide computer literacy training to students and adults in underserved communities.",
            priority: "medium",
            estimatedMinutes: 120,
            tags: ["computer", "literacy", "technology", "training"],
        },
        {
            title: "Organize Study Materials",
            description:
                "Sort, organize, and prepare study materials and textbooks for distribution to students.",
            priority: "low",
            estimatedMinutes: 90,
            tags: ["materials", "organization", "textbooks", "preparation"],
        },
        {
            title: "Conduct Tutoring Session",
            description:
                "Provide individual or group tutoring sessions for students struggling with academic subjects.",
            priority: "high",
            estimatedMinutes: 100,
            tags: ["tutoring", "academics", "support", "education"],
        },
        {
            title: "Set Up Mobile Library",
            description:
                "Organize and set up mobile library services to reach students in remote areas.",
            priority: "medium",
            estimatedMinutes: 150,
            tags: ["library", "mobile", "books", "remote"],
        },
        {
            title: "Develop Learning Games",
            description:
                "Create interactive learning games and activities that make education engaging and fun.",
            priority: "low",
            estimatedMinutes: 110,
            tags: ["games", "interactive", "learning", "fun"],
        },
        {
            title: "Coordinate Scholarship Program",
            description:
                "Manage scholarship applications and coordinate support for deserving students.",
            priority: "medium",
            estimatedMinutes: 80,
            tags: ["scholarship", "coordination", "support", "students"],
        },
    ],
};

// Helper function to get random due date between 1-30 days from now
function getRandomDueDate() {
    const now = new Date();
    const daysFromNow = Math.floor(Math.random() * 30) + 1; // 1-30 days
    return new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
}

// Helper function to get random status based on probability
function getRandomStatus() {
    const random = Math.random();
    if (random < 0.4) return "free"; // 40% free tasks
    if (random < 0.7) return "in-progress"; // 30% in-progress
    if (random < 0.9) return "done"; // 20% done
    return "cancelled"; // 10% cancelled
}

// Helper function to add completed details for done tasks
function addCompletedDetails(task) {
    if (task.status === "done") {
        const completionDate = new Date(
            Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
        ); // Completed in last 14 days
        return {
            ...task,
            completedAt: completionDate,
            actualMinutes:
                task.estimatedMinutes + Math.floor(Math.random() * 40) - 20, // ±20 minutes variation
        };
    }
    return task;
}

async function createTasksForNgos() {
    console.log("📋 Creating comprehensive tasks for all NGOs...");

    try {
        // Clear existing tasks
        console.log("🗑️  Removing existing tasks...");
        const deletedTasks = await Task.deleteMany({});
        console.log(`✅ Cleared ${deletedTasks.deletedCount} existing tasks`);

        // Get all NGOs with their categories
        const ngos = await Ngo.find({}).populate("category user");
        console.log(`🏢 Found ${ngos.length} NGOs`);

        // Get all categories for reference
        const categories = await Category.find({ type: "ngo" });
        const categoryMap = {};
        categories.forEach((cat) => {
            categoryMap[cat.name] = cat._id;
        });

        // Get all users for task assignment
        const allUsers = await User.find({
            role: { $in: ["volunteer", "ngoMember"] },
            isActive: true,
        });
        console.log(
            `👥 Found ${allUsers.length} users available for task assignment`
        );

        const allTasks = [];
        let taskStats = {
            total: 0,
            byStatus: { free: 0, "in-progress": 0, done: 0, cancelled: 0 },
            byPriority: { low: 0, medium: 0, high: 0 },
            byNgo: {},
        };

        // Create tasks for each NGO
        for (const ngo of ngos) {
            const categoryName = ngo.category[0]?.name;
            const templates =
                taskTemplates[categoryName] || taskTemplates["Education"]; // Default to Education if category not found

            console.log(
                `📝 Creating tasks for ${ngo.name} (${categoryName})...`
            );

            // Create 8-12 tasks per NGO for variety
            const numTasks = Math.floor(Math.random() * 5) + 8; // 8-12 tasks
            const ngoTasks = [];

            for (let i = 0; i < numTasks; i++) {
                const template =
                    templates[Math.floor(Math.random() * templates.length)];
                const status = getRandomStatus();

                let task = {
                    title: template.title,
                    description: template.description,
                    category:
                        categoryMap[categoryName] || categoryMap["Education"],
                    ngo: ngo._id,
                    createdBy: ngo.user._id,
                    status: status,
                    priority: template.priority,
                    estimatedMinutes: template.estimatedMinutes,
                    tags: template.tags,
                    dueDate: getRandomDueDate(),
                    createdAt: new Date(
                        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
                    ), // Created in last 30 days
                };

                // Assign tasks to users (some assigned, some free)
                if (status !== "free" && Math.random() > 0.3) {
                    // 70% chance of assignment for non-free tasks
                    const randomUser =
                        allUsers[Math.floor(Math.random() * allUsers.length)];
                    task.assignedTo = randomUser._id;
                }

                // Add completion details for done tasks
                task = addCompletedDetails(task);

                ngoTasks.push(task);

                // Update statistics
                taskStats.total++;
                taskStats.byStatus[status]++;
                taskStats.byPriority[template.priority]++;
                taskStats.byNgo[ngo.name] =
                    (taskStats.byNgo[ngo.name] || 0) + 1;
            }

            allTasks.push(...ngoTasks);
            console.log(`✅ Created ${ngoTasks.length} tasks for ${ngo.name}`);
        }

        // Insert all tasks
        console.log("💾 Inserting all tasks into database...");
        const insertedTasks = await Task.insertMany(allTasks);
        console.log(`✅ Successfully inserted ${insertedTasks.length} tasks`);

        // Display comprehensive statistics
        console.log("\n📊 TASK SEEDING SUMMARY:");
        console.log("=".repeat(60));
        console.log(`📋 Total Tasks Created: ${taskStats.total}`);

        console.log("\n📈 Status Distribution:");
        Object.entries(taskStats.byStatus).forEach(([status, count]) => {
            const percentage = ((count / taskStats.total) * 100).toFixed(1);
            console.log(`   • ${status}: ${count} (${percentage}%)`);
        });

        console.log("\n🎯 Priority Distribution:");
        Object.entries(taskStats.byPriority).forEach(([priority, count]) => {
            const percentage = ((count / taskStats.total) * 100).toFixed(1);
            console.log(`   • ${priority}: ${count} (${percentage}%)`);
        });

        console.log("\n🏢 Tasks by NGO:");
        Object.entries(taskStats.byNgo)
            .sort(([, a], [, b]) => b - a)
            .forEach(([ngoName, count]) => {
                console.log(`   • ${ngoName}: ${count} tasks`);
            });

        // Show assignment statistics
        const assignedTasks = insertedTasks.filter((task) => task.assignedTo);
        const unassignedTasks = insertedTasks.filter(
            (task) => !task.assignedTo
        );
        console.log(`\n👤 Assignment Statistics:`);
        console.log(
            `   • Assigned Tasks: ${assignedTasks.length} (${(
                (assignedTasks.length / taskStats.total) *
                100
            ).toFixed(1)}%)`
        );
        console.log(
            `   • Available Tasks: ${unassignedTasks.length} (${(
                (unassignedTasks.length / taskStats.total) *
                100
            ).toFixed(1)}%)`
        );

        // Show upcoming deadlines
        const upcomingTasks = insertedTasks
            .filter(
                (task) =>
                    task.status === "free" || task.status === "in-progress"
            )
            .filter((task) => task.dueDate > new Date())
            .sort((a, b) => a.dueDate - b.dueDate)
            .slice(0, 5);

        console.log(`\n⏰ Upcoming Deadlines (Next 5):`);
        upcomingTasks.forEach((task, index) => {
            const daysUntilDue = Math.ceil(
                (task.dueDate - new Date()) / (1000 * 60 * 60 * 24)
            );
            console.log(
                `   ${index + 1}. "${
                    task.title
                }" - Due in ${daysUntilDue} days (${task.priority} priority)`
            );
        });

        return insertedTasks;
    } catch (error) {
        console.error("❌ Error creating tasks:", error);
        throw error;
    }
}

const seedTasks = async (keepConnectionOpen = false) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("🔗 Connected to database");
        }

        const tasks = await createTasksForNgos();

        console.log("🎉 Successfully created all tasks!");

        if (!keepConnectionOpen) {
            console.log("🔒 Closing database connection...");
            await mongoose.connection.close();
            console.log("✅ Database connection closed");
        }

        return tasks;
    } catch (error) {
        console.error("❌ Error seeding tasks:", error);
        throw error;
    }
};

// Run the seeding function
if (require.main === module) {
    seedTasks()
        .then(() => {
            console.log("🏁 Task seeding completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Task seeding failed:", error);
            process.exit(1);
        });
}

module.exports = { seedTasks };
