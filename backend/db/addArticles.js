//Use this to add articles to the db

const mongoose = require("mongoose");
const Article = require("../models/article");
const connectDB = require("./connect");

const Articles = [
    {
        title: "Creating Tasks",
        content: "To create a task, go to the Tasks page and click 'Create Task'. Fill in the task details including title, description, deadline, and assign it to volunteers. Make sure to provide clear instructions and any necessary resources.",
        category: "tasks",
        source: "User Guide Section 3.2",
        tags: ["task", "create", "volunteer", "assignment"],
    },
    {
        title: "NGO Location Mapping",
        content: "View NGO locations on the Map page. Click any marker for detailed information about the NGO including contact details, services offered, and current projects. You can filter NGOs by category or search by name.",
        category: "navigation",
        source: "User Guide Section 5.1",
        tags: ["ngo", "location", "map", "marker", "filter"],
    },
    {
        title: "Adding New NGO",
        content: "To add a new NGO, go to NGO Management and click 'Add NGO'. Fill in the required information including organization name, location coordinates, contact information, description of services, and upload relevant documents.",
        category: "ngo",
        source: "User Guide Section 2.1",
        tags: ["ngo", "add", "register", "management", "organization"],
    },
    {
        title: "Donation Reports and Analytics",
        content: "View comprehensive donation reports in the Analytics section. Select your desired date range and click 'Generate Report' to see donation trends, top donors, category-wise breakdowns, and impact metrics.",
        category: "analytics",
        source: "User Guide Section 4.3",
        tags: ["donation", "report", "analytics", "trends", "metrics"],
    },
    {
        title: "User Profile Management",
        content: "Access your profile by clicking on your name in the header. You can update personal information, change password, manage notification preferences, and view your contribution history.",
        category: "users",
        source: "User Guide Section 1.2",
        tags: ["profile", "user", "settings", "password", "preferences"],
    },
    {
        title: "Making Donations",
        content: "To make a donation, select an NGO from the list and click 'Donate'. Choose your donation amount, payment method, and add any special instructions. You'll receive a confirmation email with receipt details.",
        category: "donations",
        source: "User Guide Section 6.1",
        tags: ["donate", "payment", "amount", "receipt", "contribution"],
    },
    {
        title: "Dashboard Overview",
        content: "The main dashboard provides an overview of all your activities including recent donations, assigned tasks, NGO updates, and system notifications. Use the sidebar to navigate between different sections.",
        category: "navigation",
        source: "User Guide Section 1.1",
        tags: ["dashboard", "overview", "navigation", "sidebar", "activities"],
    },
    {
        title: "Task Management",
        content: "Manage your tasks from the Tasks section. You can view assigned tasks, mark them as complete, add progress updates, and communicate with team members through task comments.",
        category: "tasks",
        source: "User Guide Section 3.3",
        tags: ["task", "management", "progress", "complete", "comments"],
    },
    {
        title: "Volunteer Onboarding Process",
        content: "New volunteers can register through the volunteer portal. Complete your profile, undergo background verification, attend orientation sessions, and choose your preferred NGO partnerships. Track your volunteer hours and impact contributions.",
        category: "users",
        source: "Volunteer Guide Section 2.1",
        tags: ["volunteer", "onboarding", "registration", "verification", "orientation"],
    },
    {
        title: "NGO Partnership Management",
        content: "Manage your NGO partnerships through the Partnership section. View active collaborations, schedule meetings, share resources, track joint projects, and evaluate partnership effectiveness. Access shared documents and communication channels.",
        category: "ngo",
        source: "Partnership Guide Section 4.2",
        tags: ["partnership", "collaboration", "meetings", "resources", "projects"],
    },
    {
        title: "Donation Tracking and Receipts",
        content: "Track all your donations in the Donation History section. View detailed transaction records, download tax receipts, see impact reports for your contributions, and set up recurring donations. Export data for personal records.",
        category: "donations",
        source: "Donor Guide Section 3.1",
        tags: ["tracking", "receipts", "history", "impact", "recurring", "tax"],
    },
    {
        title: "Impact Story Creation",
        content: "Share your impact stories to inspire others. Upload photos, write compelling narratives, include testimonials, and highlight measurable outcomes. Stories are reviewed before publication and shared across the platform.",
        category: "general",
        source: "Content Guide Section 5.3",
        tags: ["impact", "stories", "photos", "testimonials", "outcomes", "publication"],
    },
    {
        title: "Advanced Search and Filters",
        content: "Use advanced search features to find specific NGOs, projects, or volunteers. Apply filters by location, cause category, organization size, rating, and activity level. Save search preferences for quick access.",
        category: "navigation",
        source: "Search Guide Section 2.4",
        tags: ["search", "filters", "location", "category", "rating", "preferences"],
    },
    {
        title: "Mobile App Features",
        content: "Access Grace platform features on mobile devices. Get push notifications for updates, use quick donation features, check-in at volunteer events, and sync data across devices. Download the app from app stores.",
        category: "general",
        source: "Mobile Guide Section 1.1",
        tags: ["mobile", "app", "notifications", "sync", "events", "download"],
    },
    {
        title: "Fundraising Campaign Management",
        content: "Create and manage fundraising campaigns for your NGO. Set goals, track progress, engage supporters, share updates, and manage campaign analytics. Use social media integration for broader reach.",
        category: "donations",
        source: "Fundraising Guide Section 6.2",
        tags: ["fundraising", "campaigns", "goals", "progress", "supporters", "social media"],
    },
    {
        title: "Volunteer Skills Assessment",
        content: "Complete skills assessments to match with suitable volunteer opportunities. Update your skills profile, take certification courses, and track skill development progress. Get recommended tasks based on your expertise.",
        category: "users",
        source: "Skills Guide Section 3.4",
        tags: ["skills", "assessment", "matching", "certification", "development", "recommendations"],
    },
    {
        title: "Data Privacy and Security",
        content: "Your data privacy is protected through encryption, secure storage, and limited access controls. Review privacy settings, manage data sharing preferences, and understand how your information is used. Report security concerns immediately.",
        category: "general",
        source: "Privacy Guide Section 7.1",
        tags: ["privacy", "security", "encryption", "data", "settings", "concerns"],
    },
    {
        title: "Communication Tools",
        content: "Use built-in communication tools to connect with team members, NGO coordinators, and fellow volunteers. Access messaging, video calls, group chats, and announcement boards. Set notification preferences.",
        category: "general",
        source: "Communication Guide Section 4.5",
        tags: ["communication", "messaging", "video calls", "groups", "announcements", "notifications"],
    },
    {
        title: "Event Management",
        content: "Create, promote, and manage events through the Events section. Set up registration, manage attendees, send reminders, track participation, and gather feedback. Integrate with calendar applications.",
        category: "tasks",
        source: "Events Guide Section 5.2",
        tags: ["events", "registration", "attendees", "reminders", "participation", "calendar"],
    },
    {
        title: "Resource Library Access",
        content: "Access the comprehensive resource library with training materials, best practices, templates, and educational content. Bookmark useful resources, contribute your own materials, and rate content quality.",
        category: "navigation",
        source: "Resources Guide Section 6.3",
        tags: ["resources", "library", "training", "templates", "education", "bookmarks"],
    },
    {
        title: "Performance Analytics Dashboard",
        content: "Monitor your impact through the analytics dashboard. View volunteer hours, donation impacts, task completion rates, and community engagement metrics. Generate custom reports and export data.",
        category: "analytics",
        source: "Analytics Guide Section 8.1",
        tags: ["performance", "analytics", "metrics", "reports", "engagement", "export"],
    },
    {
        title: "Multi-language Support",
        content: "The platform supports multiple languages for global accessibility. Change language preferences in settings, contribute translations, and access localized content. Help expand language support for your community.",
        category: "general",
        source: "Localization Guide Section 2.3",
        tags: ["language", "multilingual", "translations", "localization", "accessibility", "global"],
    },
    {
        title: "Troubleshooting Common Issues",
        content: "Find solutions to common platform issues. Check connection problems, resolve login difficulties, fix sync issues, and recover lost data. Access step-by-step guides and contact support when needed.",
        category: "general",
        source: "Support Guide Section 9.1",
        tags: ["troubleshooting", "issues", "connection", "login", "sync", "support"],
    },
];

async function addArticles() {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Connecting to the database...");
            await connectDB();
        }

        for (const articleData of Articles) {
            try{
                const existingArticles = await Article.findOne({
                    title: articleData.title,
                    category: articleData.category,
                });

                if (existingArticles){
                    console.log(`Article '${articleData.title}' already exists`);
                } else {
                    const article = new Article(articleData);
                    await article.save();
                    console.log(`Article '${articleData.title}' added successfully`);
                }
            } catch (error) {
                console.error(`Error adding article '${articleData.title}':`, error.message);
            }
        }

        console.log("Article addition process completed");
        return true;
    } catch (error) {
        console.error("Error adding articles to database:", error.message);
        return false;
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("Database connection closed");
        }
    }
}

// Export the function for use in other files
module.exports = { addArticles };

// If this file is run directly, execute the function
if (require.main === module) {
    addArticles();
}