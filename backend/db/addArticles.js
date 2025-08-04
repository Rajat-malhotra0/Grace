//Use this to add articles to the db

const mongoose = require("mongoose");
const Article = require("../models/article");
const connectDB = require("./connect");

const Articles = [
    // GETTING STARTED ARTICLES
    {
        title: "Getting Started with Grace Platform",
        content:
            "Grace is a comprehensive NGO management platform that connects NGOs with volunteers and donors. Whether you're an NGO, volunteer, or donor, start by creating an account and completing your profile. NGOs can list their needs, manage volunteers, and track donations. Volunteers can find opportunities that match their skills. Donors can discover causes and make meaningful contributions through our marketplace system.",
        category: "general",
        source: "Getting Started Guide",
        tags: [
            "getting started",
            "registration",
            "platform overview",
            "new user",
        ],
        isActive: true,
    },

    // NGO MANAGEMENT ARTICLES
    {
        title: "NGO Registration and Profile Setup",
        content:
            "To register your NGO on Grace, go to the registration page and select 'NGO' as your role. Fill in your organization name, registration number, contact details, address, and description. Upload relevant documents for verification. Once registered, complete your NGO profile with mission statement, focus areas, and cover images. A team member will verify your information and help set up your public profile.",
        category: "ngo",
        source: "NGO Guide",
        tags: ["ngo", "registration", "profile", "verification", "setup"],
        isActive: true,
    },
    {
        title: "Managing NGO Projects and Programs",
        content:
            "NGOs can showcase their work through the Projects section. Add project details including title, description, and images. Each project card displays on your NGO page and helps visitors understand your impact. Update project information regularly to keep supporters informed about your ongoing work and achievements.",
        category: "ngo",
        source: "NGO Guide",
        tags: ["ngo", "projects", "programs", "showcase", "impact"],
        isActive: true,
    },
    {
        title: "Creating Volunteer Opportunities",
        content:
            "NGOs can create volunteer opportunities by setting up volunteer cards with specific roles. Include opportunity title, description, people needed, and duration. Common opportunities include Reading Circle Facilitator, Art Therapy Assistant, Community Outreach Coordinator, and Meal Preparation Volunteer. Clearly describe expectations and time commitments to attract suitable volunteers.",
        category: "ngo",
        source: "Volunteer Management Guide",
        tags: ["volunteer", "opportunities", "recruitment", "ngo management"],
        isActive: true,
    },

    // MARKETPLACE ARTICLES
    {
        title: "Using the Grace Marketplace",
        content:
            "The Grace Marketplace connects NGO needs with donor generosity. Browse donation categories including Food & Nutrition, Clothing & Apparel, Books & Stationery, Medical & Hygiene Supplies, Technology, Furniture & Essentials, Toys & Recreation, Skill Tools, and Other Items. Each category shows real-time needs from verified NGOs with details about quantity, urgency, and location.",
        category: "donations",
        source: "Marketplace Guide",
        tags: ["marketplace", "donations", "categories", "ngo needs", "giving"],
        isActive: true,
    },
    {
        title: "Posting Donation Needs to Marketplace",
        content:
            "NGOs can post their specific needs through the Donation Needs Request form in their dashboard. Fill in item name, description, category, quantity needed, urgency level, location, and deadline. Choose from categories like Food & Nutrition, Medical Supplies, Technology, etc. Your needs will appear in the marketplace for donors to fulfill. Track fulfillment status through your marketplace insights dashboard.",
        category: "ngo",
        source: "NGO Dashboard Guide",
        tags: ["ngo", "marketplace", "needs", "posting", "donations"],
        isActive: true,
    },
    {
        title: "Fulfilling Donation Needs",
        content:
            "Browse the marketplace to find donation needs you can fulfill. Click on any category to see specific items needed by NGOs. Each need shows the NGO name, item details, quantity, urgency level, and location. Click 'I Can Help' to fulfill a need - the NGO will be notified and you'll receive confirmation. You can also contact the NGO directly for coordination.",
        category: "donations",
        source: "Donor Guide",
        tags: ["donations", "fulfillment", "helping", "marketplace", "giving"],
        isActive: true,
    },

    // VOLUNTEER ARTICLES
    {
        title: "Volunteer Registration and Profile",
        content:
            "Register as a volunteer by selecting your volunteer type: individual, school partnership, corporate partnership, internship, or career volunteer. Complete your profile with skills, interests, and availability. School and corporate volunteers need additional organization details. Individual volunteers can take skill assessments to get matched with suitable opportunities.",
        category: "users",
        source: "Volunteer Guide",
        tags: ["volunteer", "registration", "profile", "types", "matching"],
        isActive: true,
    },
    {
        title: "Finding Volunteer Opportunities",
        content:
            "Discover volunteer opportunities by browsing NGO profiles or taking our skills quiz. Each NGO page shows available volunteer roles with descriptions, time commitments, and people needed. Common roles include teaching, mentoring, event coordination, meal preparation, and administrative support. Contact NGOs directly through their volunteer buttons to express interest.",
        category: "users",
        source: "Volunteer Guide",
        tags: ["volunteer", "opportunities", "search", "skills", "matching"],
        isActive: true,
    },
    {
        title: "Volunteer Skills Assessment and Quiz",
        content:
            "Take our volunteer skills quiz to discover how you can best contribute to NGO work. The quiz assesses your interests, skills, and availability to recommend suitable volunteer opportunities. Based on your results, you'll get personalized NGO recommendations and specific roles that match your profile. Retake the quiz anytime as your interests evolve.",
        category: "users",
        source: "Skills Assessment Guide",
        tags: ["quiz", "skills", "assessment", "volunteer", "recommendations"],
        isActive: true,
    },

    // DONATION ARTICLES
    {
        title: "Making Direct Donations to NGOs",
        content:
            "Support NGOs through direct monetary donations. Visit any NGO's profile page and click the 'Donate' button. Choose your donation amount, payment method, and add personal messages. You'll receive confirmation emails with receipt details for tax purposes. Set up recurring donations for ongoing support. Track your donation history and impact through your profile.",
        category: "donations",
        source: "Donation Guide",
        tags: ["donations", "money", "payment", "recurring", "tax receipts"],
        isActive: true,
    },
    {
        title: "Donation Categories and Impact",
        content:
            "Make targeted donations through our categorized system. Food & Nutrition helps feed families, Education supports learning materials, Healthcare provides medical supplies, and Technology bridges digital gaps. Each category shows real NGO needs with specific items, quantities, and deadlines. Your donations directly fulfill these needs and create measurable impact.",
        category: "donations",
        source: "Impact Guide",
        tags: [
            "donations",
            "categories",
            "impact",
            "specific needs",
            "targeted giving",
        ],
        isActive: true,
    },

    // DASHBOARD AND ANALYTICS ARTICLES
    {
        title: "NGO Dashboard and Task Management",
        content:
            "NGO admins can access comprehensive dashboards to manage their operations. Create and assign tasks to team members, track volunteer hours, monitor donation requests, and view analytics. The dashboard provides overview of activities, volunteer statistics, marketplace insights, and donation tracking. Use the task management system to coordinate team activities and project milestones.",
        category: "tasks",
        source: "NGO Dashboard Guide",
        tags: ["dashboard", "tasks", "ngo admin", "management", "analytics"],
        isActive: true,
    },
    {
        title: "Marketplace Insights for NGOs",
        content:
            "NGOs can track their marketplace performance through detailed insights. View statistics on posted needs, fulfillment rates, average fulfillment time, top contributors, and urgent unfulfilled requests. Filter data by time periods (week, month, quarter, year) to analyze trends. This helps optimize your posting strategy and understand donor engagement patterns.",
        category: "analytics",
        source: "Marketplace Analytics Guide",
        tags: [
            "analytics",
            "marketplace",
            "ngo insights",
            "performance",
            "tracking",
        ],
        isActive: true,
    },
    {
        title: "Volunteer Analytics for NGOs",
        content:
            "NGOs can monitor volunteer engagement through comprehensive analytics. View total volunteers, active participants, new registrations, retention rates, and task completion statistics. Track volunteer types, skill distribution, location demographics, and top performers. Use these insights to improve volunteer programs and recognize outstanding contributors.",
        category: "analytics",
        source: "Volunteer Analytics Guide",
        tags: [
            "analytics",
            "volunteers",
            "engagement",
            "ngo management",
            "performance",
        ],
        isActive: true,
    },

    // USER MANAGEMENT ARTICLES
    {
        title: "User Profile Management",
        content:
            "Manage your Grace profile by clicking on your name in the header. Update personal information including name, email, address, and contact details. Change your password and manage notification preferences. View your contribution history including donations made, volunteer hours, and tasks completed. Keep your profile updated to receive relevant opportunities and communications.",
        category: "users",
        source: "Profile Guide",
        tags: [
            "profile",
            "user management",
            "settings",
            "personal info",
            "preferences",
        ],
        isActive: true,
    },
    {
        title: "Account Types and Roles",
        content:
            "Grace supports multiple user types: NGOs manage organizations and projects, Volunteers offer time and skills, Donors provide financial and material support, and NGO Members assist with organizational tasks. Each role has specific features and access levels. You can update your role preferences in your profile settings to access relevant tools and opportunities.",
        category: "users",
        source: "Account Guide",
        tags: ["user types", "roles", "permissions", "account", "access"],
        isActive: true,
    },

    // NAVIGATION AND FEATURES
    {
        title: "Platform Navigation and Features",
        content:
            "Navigate Grace using the main menu: Home showcases featured NGOs and impact stories, Marketplace displays donation needs, Quiz helps volunteers find their best fit, About explains our mission, and Login/Register for account access. Logged-in users see additional options like Dashboard, Profile, and role-specific features. Use the search function to find specific NGOs or causes.",
        category: "navigation",
        source: "Navigation Guide",
        tags: [
            "navigation",
            "menu",
            "features",
            "platform tour",
            "user interface",
        ],
        isActive: true,
    },
    {
        title: "Grace Impact Stories and Community",
        content:
            "Explore real impact stories on our platform to see how Grace connects communities. These stories showcase successful collaborations between NGOs, volunteers, and donors. Share your own impact experiences to inspire others. Impact stories help build trust, demonstrate effectiveness, and motivate continued participation in our community of changemakers.",
        category: "general",
        source: "Community Guide",
        tags: [
            "impact stories",
            "community",
            "inspiration",
            "success stories",
            "sharing",
        ],
        isActive: true,
    },

    // TECHNICAL SUPPORT
    {
        title: "Getting Help and Support",
        content:
            "Need assistance with Grace? Use our AI chatbot for instant help with common questions about navigation, donations, volunteer opportunities, and account management. For complex issues, contact our team at teamgrace@gmail.com. Check the About page for platform information and mission details. Report technical issues or suggest improvements through our support channels.",
        category: "general",
        source: "Support Guide",
        tags: ["help", "support", "chatbot", "contact", "assistance"],
        isActive: true,
    },
    {
        title: "Understanding Grace Mission and Vision",
        content:
            "Grace aims to unify NGO support by connecting organizations with volunteers and donors through one comprehensive platform. We help NGOs build online presence, track volunteers, manage donations, create events, and maintain transparency. For volunteers, we provide NGO discovery, easy signup, and real-time updates. For donors, we offer secure giving, impact tracking, and direct connections to causes.",
        category: "general",
        source: "About Grace",
        tags: [
            "mission",
            "vision",
            "platform purpose",
            "NGO support",
            "community building",
        ],
        isActive: true,
    },

    // FEED AND SOCIAL FEATURES
    {
        title: "Creating Posts in Grace Feed",
        content:
            "To create a post in the Grace feed, navigate to your dashboard and look for the 'Create Post' or 'Share Update' section. You can share impact stories, project updates, volunteer achievements, or community announcements. Include images, descriptions, and relevant hashtags to increase engagement. Posts help build community connections and showcase your NGO's work to supporters and potential volunteers.",
        category: "general",
        source: "Feed Guide",
        tags: ["feed", "posts", "social", "sharing", "updates", "community"],
        isActive: true,
    },
    {
        title: "Managing Grace Feed and Social Updates",
        content:
            "The Grace Feed is your social hub for sharing updates and connecting with the community. Create posts about your activities, share photos from events, announce volunteer opportunities, and celebrate achievements. Use the feed to build relationships with supporters, share impact stories, and keep your community engaged. You can like, comment, and share posts from other NGOs and users.",
        category: "general",
        source: "Social Features Guide",
        tags: ["feed", "social", "community", "engagement", "updates"],
        isActive: true,
    },

    // DASHBOARD ACCESS AND NAVIGATION
    {
        title: "Accessing Volunteer Dashboard",
        content:
            "To access your volunteer dashboard, log in to Grace and click on 'Dashboard' in the main navigation menu. The volunteer dashboard shows your active opportunities, completed tasks, upcoming events, volunteer hours logged, and impact metrics. You can view assigned tasks, update your availability, track your contributions, and connect with NGOs. The dashboard is your central hub for managing all volunteer activities.",
        category: "users",
        source: "Volunteer Dashboard Guide",
        tags: ["volunteer", "dashboard", "access", "navigation", "tasks"],
        isActive: true,
    },
    {
        title: "NGO Member Dashboard Features",
        content:
            "NGO members can access specialized dashboard features by logging in and navigating to the Dashboard section. The NGO member dashboard includes task management, volunteer coordination, event planning, donation tracking, and reporting tools. You can create and assign tasks, manage volunteer schedules, update project status, and generate reports. Access depends on your role permissions within the NGO.",
        category: "users",
        source: "NGO Member Guide",
        tags: [
            "ngo member",
            "dashboard",
            "tasks",
            "coordination",
            "management",
        ],
        isActive: true,
    },
    {
        title: "Dashboard Navigation and Features Overview",
        content:
            "All user dashboards in Grace are accessible through the main navigation menu after logging in. Different user types see different dashboard features: NGOs see organization management tools, volunteers see opportunity tracking, donors see contribution history, and members see assigned tasks. The dashboard adapts to your role and shows relevant metrics, notifications, and action items for your specific needs.",
        category: "navigation",
        source: "Dashboard Guide",
        tags: ["dashboard", "navigation", "features", "user roles", "overview"],
        isActive: true,
    },

    // EVENT AND ACTIVITY MANAGEMENT
    {
        title: "Creating and Managing Events",
        content:
            "NGOs can create events through their dashboard by clicking 'Create Event' in the events section. Fill in event details including title, description, date, time, location, and required volunteers. Events can be fundraisers, volunteer drives, awareness campaigns, or community programs. Share events on the feed to increase participation and track registrations through your event management panel.",
        category: "ngo",
        source: "Event Management Guide",
        tags: ["events", "creating", "management", "ngo", "volunteers"],
        isActive: true,
    },
    {
        title: "Joining and Participating in Events",
        content:
            "Browse upcoming events in the Events section or through NGO profiles. Click 'Join Event' or 'Register' to participate. You'll receive confirmation and event details via email. Events include volunteer opportunities, fundraising activities, awareness campaigns, and community programs. Track your registered events through your dashboard and receive reminders before event dates.",
        category: "users",
        source: "Event Participation Guide",
        tags: [
            "events",
            "joining",
            "participation",
            "registration",
            "volunteer",
        ],
        isActive: true,
    },

    // COMMUNICATION AND MESSAGING
    {
        title: "Messaging and Communication Features",
        content:
            "Grace provides messaging features to facilitate communication between NGOs, volunteers, and donors. Access messages through the communication icon in your dashboard. You can send direct messages, participate in group discussions, and receive notifications about opportunities and updates. Use messaging to coordinate volunteer activities, ask questions, and build relationships within the Grace community.",
        category: "general",
        source: "Communication Guide",
        tags: ["messaging", "communication", "notifications", "coordination"],
        isActive: true,
    },

    // REPORTING AND ANALYTICS
    {
        title: "Generating Reports and Analytics",
        content:
            "Access detailed reports through your dashboard's Analytics section. NGOs can generate reports on volunteer engagement, donation tracking, project progress, and impact metrics. Volunteers can view their contribution reports and volunteer hour summaries. Use filters to customize reports by date range, project, or category. Export reports for external use or sharing with stakeholders.",
        category: "analytics",
        source: "Reporting Guide",
        tags: ["reports", "analytics", "metrics", "tracking", "export"],
        isActive: true,
    },

    // MOBILE AND ACCESSIBILITY
    {
        title: "Using Grace on Mobile Devices",
        content:
            "Grace is mobile-responsive and works on smartphones and tablets. Access all features including dashboard, marketplace, messaging, and profiles through your mobile browser. The mobile interface adapts for touch navigation and smaller screens while maintaining full functionality. Download the Grace mobile app (if available) for push notifications and offline access to key features.",
        category: "general",
        source: "Mobile Guide",
        tags: ["mobile", "responsive", "app", "accessibility", "touch"],
        isActive: true,
    },
];

async function addArticles() {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Connecting to the database...");
            await connectDB();
        }

        for (const articleData of Articles) {
            try {
                const existingArticles = await Article.findOne({
                    title: articleData.title,
                    category: articleData.category,
                });

                if (existingArticles) {
                    console.log(
                        `Article '${articleData.title}' already exists`
                    );
                } else {
                    const article = new Article(articleData);
                    await article.save();
                    console.log(
                        `Article '${articleData.title}' added successfully`
                    );
                }
            } catch (error) {
                console.error(
                    `Error adding article '${articleData.title}':`,
                    error.message
                );
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
