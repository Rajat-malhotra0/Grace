const mongoose = require("mongoose");
const User = require("../models/user");
const Ngo = require("../models/ngo");
const UserNgoRelation = require("../models/userNgoRelation");
const connectDB = require("./connect");

const volunteerUsers = [
    {
        userName: "priya_sharma",
        email: "priya.sharma@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Community Outreach",
        location: {
            address: "MG Road",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            coordinates: { latitude: 19.076, longitude: 72.8777 },
        },
        leaderboardStats: {
            hours: 156,
            tasksCompleted: 42,
            impactScore: 8.7,
            currentStreak: 15,
            level: "Advanced",
        },
        score: 156,
        about: "Passionate about community development and children's education",
        dob: new Date("1995-05-15"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "raj_patel",
        email: "raj.patel@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Environmental Action",
        location: {
            address: "Civil Lines",
            city: "Delhi",
            state: "Delhi",
            pincode: "110054",
            coordinates: { latitude: 28.7041, longitude: 77.1025 },
        },
        leaderboardStats: {
            hours: 203,
            tasksCompleted: 58,
            impactScore: 9.2,
            currentStreak: 23,
            level: "Expert",
        },
        score: 203,
        about: "Environmental activist focused on sustainable practices",
        dob: new Date("1992-08-22"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "ananya_singh",
        email: "ananya.singh@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Education Support",
        location: {
            address: "Koramangala",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560034",
            coordinates: { latitude: 12.9352, longitude: 77.6245 },
        },
        leaderboardStats: {
            hours: 134,
            tasksCompleted: 38,
            impactScore: 8.1,
            currentStreak: 12,
            level: "Advanced",
        },
        score: 134,
        about: "Tech professional volunteering in education initiatives",
        dob: new Date("1993-12-03"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "arjun_kumar",
        email: "arjun.kumar@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Healthcare Support",
        location: {
            address: "Banjara Hills",
            city: "Hyderabad",
            state: "Telangana",
            pincode: "500034",
            coordinates: { latitude: 17.385, longitude: 78.4867 },
        },
        leaderboardStats: {
            hours: 187,
            tasksCompleted: 51,
            impactScore: 8.9,
            currentStreak: 18,
            level: "Expert",
        },
        score: 187,
        about: "Medical student passionate about community health",
        dob: new Date("1996-01-17"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "meera_joshi",
        email: "meera.joshi@example.com",
        password: "password123",
        role: ["volunteer", "donor"],
        volunteerType: "Women Empowerment",
        location: {
            address: "Anna Nagar",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600040",
            coordinates: { latitude: 13.0827, longitude: 80.2707 },
        },
        leaderboardStats: {
            hours: 98,
            tasksCompleted: 29,
            impactScore: 7.3,
            currentStreak: 8,
            level: "Intermediate",
        },
        score: 98,
        about: "Advocate for women's rights and empowerment",
        dob: new Date("1990-09-11"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "vikram_reddy",
        email: "vikram.reddy@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Disaster Relief",
        location: {
            address: "FC Road",
            city: "Pune",
            state: "Maharashtra",
            pincode: "411004",
            coordinates: { latitude: 18.5204, longitude: 73.8567 },
        },
        leaderboardStats: {
            hours: 245,
            tasksCompleted: 67,
            impactScore: 9.5,
            currentStreak: 31,
            level: "Champion",
        },
        score: 245,
        about: "Emergency response coordinator and team leader",
        dob: new Date("1989-06-28"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "kavya_nair",
        email: "kavya.nair@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Arts & Culture",
        location: {
            address: "Marine Drive",
            city: "Kochi",
            state: "Kerala",
            pincode: "682031",
            coordinates: { latitude: 9.9312, longitude: 76.2673 },
        },
        leaderboardStats: {
            hours: 67,
            tasksCompleted: 21,
            impactScore: 6.4,
            currentStreak: 5,
            level: "Intermediate",
        },
        score: 67,
        about: "Artist using creativity for social change",
        dob: new Date("1997-03-25"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "rohit_gupta",
        email: "rohit.gupta@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Technology Education",
        location: {
            address: "Sector 18",
            city: "Noida",
            state: "Uttar Pradesh",
            pincode: "201301",
            coordinates: { latitude: 28.5355, longitude: 77.391 },
        },
        leaderboardStats: {
            hours: 112,
            tasksCompleted: 34,
            impactScore: 7.8,
            currentStreak: 11,
            level: "Advanced",
        },
        score: 112,
        about: "Software engineer teaching coding to underprivileged youth",
        dob: new Date("1991-11-08"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "sneha_agarwal",
        email: "sneha.agarwal@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Animal Welfare",
        location: {
            address: "City Center",
            city: "Jaipur",
            state: "Rajasthan",
            pincode: "302006",
            coordinates: { latitude: 26.9124, longitude: 75.7873 },
        },
        leaderboardStats: {
            hours: 89,
            tasksCompleted: 26,
            impactScore: 7.1,
            currentStreak: 7,
            level: "Intermediate",
        },
        score: 89,
        about: "Veterinarian passionate about animal rights",
        dob: new Date("1994-07-14"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "aditya_malik",
        email: "aditya.malik@example.com",
        password: "password123",
        role: ["volunteer"],
        volunteerType: "Sports & Recreation",
        location: {
            address: "Lajpat Nagar",
            city: "Delhi",
            state: "Delhi",
            pincode: "110024",
            coordinates: { latitude: 28.5678, longitude: 77.243 },
        },
        leaderboardStats: {
            hours: 143,
            tasksCompleted: 41,
            impactScore: 8.3,
            currentStreak: 14,
            level: "Advanced",
        },
        score: 143,
        about: "Sports coach working with disadvantaged youth",
        dob: new Date("1988-04-02"),
        termsAccepted: true,
        isActive: true,
    },
];

// NGO team members for specific NGOs
const ngoMembers = [
    {
        userName: "sarah_coordinator",
        email: "sarah@littlelanterns.org",
        password: "password123",
        role: ["ngoMember"],
        location: {
            address: "Children's Center",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
        },
        organization: {
            name: "Little Lanterns",
            role: "Program Coordinator",
            department: "Education",
        },
        leaderboardStats: {
            hours: 198,
            tasksCompleted: 56,
            impactScore: 9.1,
            currentStreak: 21,
            level: "Expert",
        },
        score: 198,
        about: "Dedicated coordinator managing education programs",
        dob: new Date("1987-02-15"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "michael_teacher",
        email: "michael@aashasapne.org",
        password: "password123",
        role: ["ngoMember"],
        location: {
            address: "Learning Center",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001",
        },
        organization: {
            name: "Aasha Sapne",
            role: "Head Teacher",
            department: "Education",
        },
        leaderboardStats: {
            hours: 176,
            tasksCompleted: 48,
            impactScore: 8.8,
            currentStreak: 19,
            level: "Expert",
        },
        score: 176,
        about: "Experienced educator fostering children's dreams",
        dob: new Date("1985-09-22"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "lisa_field_manager",
        email: "lisa@earthnest.org",
        password: "password123",
        role: ["ngoMember"],
        location: {
            address: "Green Campus",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560001",
        },
        organization: {
            name: "EarthNest",
            role: "Field Manager",
            department: "Environmental Programs",
        },
        leaderboardStats: {
            hours: 167,
            tasksCompleted: 45,
            impactScore: 8.6,
            currentStreak: 16,
            level: "Advanced",
        },
        score: 167,
        about: "Environmental scientist leading conservation efforts",
        dob: new Date("1990-06-10"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "preethi_counselor",
        email: "preethi@herrise.org",
        password: "password123",
        role: ["ngoMember"],
        location: {
            address: "Women's Center",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001",
        },
        organization: {
            name: "HerRise",
            role: "Counselor",
            department: "Women Support",
        },
        leaderboardStats: {
            hours: 189,
            tasksCompleted: 52,
            impactScore: 9.0,
            currentStreak: 20,
            level: "Expert",
        },
        score: 189,
        about: "Psychologist empowering women through counseling",
        dob: new Date("1988-12-05"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "dr_kumar_health",
        email: "drkumar@healthfirst.org",
        password: "password123",
        role: ["ngoMember"],
        location: {
            address: "Health Center",
            city: "Hyderabad",
            state: "Telangana",
            pincode: "500001",
        },
        organization: {
            name: "HealthFirst Initiative",
            role: "Medical Officer",
            department: "Healthcare",
        },
        leaderboardStats: {
            hours: 234,
            tasksCompleted: 63,
            impactScore: 9.4,
            currentStreak: 28,
            level: "Champion",
        },
        score: 234,
        about: "Doctor providing healthcare to underserved communities",
        dob: new Date("1983-03-18"),
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "teacher_rajesh",
        email: "rajesh@learningbridge.org",
        password: "password123",
        role: ["ngoMember"],
        location: {
            address: "Education Hub",
            city: "Pune",
            state: "Maharashtra",
            pincode: "411001",
        },
        organization: {
            name: "Learning Bridge",
            role: "Senior Teacher",
            department: "Education",
        },
        leaderboardStats: {
            hours: 154,
            tasksCompleted: 43,
            impactScore: 8.4,
            currentStreak: 13,
            level: "Advanced",
        },
        score: 154,
        about: "Educator bridging learning gaps for underprivileged students",
        dob: new Date("1986-08-30"),
        termsAccepted: true,
        isActive: true,
    },
];

// Donor users
const donorUsers = [
    {
        userName: "corporate_donor_1",
        email: "donations@techcorp.com",
        password: "password123",
        role: ["donor"],
        location: {
            address: "Tech Park",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560001",
        },
        organization: {
            name: "TechCorp Industries",
            role: "CSR Manager",
            department: "Corporate Social Responsibility",
        },
        leaderboardStats: {
            hours: 45,
            tasksCompleted: 12,
            impactScore: 6.8,
            currentStreak: 3,
            level: "Beginner",
        },
        score: 45,
        about: "Corporate social responsibility manager",
        termsAccepted: true,
        isActive: true,
    },
    {
        userName: "individual_donor_1",
        email: "generous@donor.com",
        password: "password123",
        role: ["donor"],
        location: {
            address: "Residential Area",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
        },
        leaderboardStats: {
            hours: 23,
            tasksCompleted: 6,
            impactScore: 5.2,
            currentStreak: 2,
            level: "Beginner",
        },
        score: 23,
        about: "Individual donor supporting multiple causes",
        termsAccepted: true,
        isActive: true,
    },
];

// Helper function to generate random last active dates
function getRandomLastActiveDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
    return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

// Add random variations to users
function addRandomVariations(users) {
    return users.map((user) => ({
        ...user,
        lastActiveDate: getRandomLastActiveDate(),
        newsLetter: Math.random() > 0.5,
        remindMe: Math.random() > 0.3,
    }));
}

async function createUsersAndRelations() {
    console.log("👥 Creating diverse users for rich leaderboard experience...");

    try {
        // Clear existing users (except NGO owner users which were created by addNgo.js)
        console.log("🗑️  Removing existing volunteer/member/donor users...");
        await User.deleteMany({
            role: {
                $in: [
                    ["volunteer"],
                    ["ngoMember"],
                    ["donor"],
                    ["volunteer", "donor"],
                ],
            },
        });
        await UserNgoRelation.deleteMany({});
        console.log("✅ Cleared existing volunteer/member users");

        // Create volunteer users
        console.log("🎯 Creating volunteer users...");
        const volunteerUsersWithVariations =
            addRandomVariations(volunteerUsers);
        const createdVolunteers = await User.insertMany(
            volunteerUsersWithVariations
        );
        console.log(`✅ Created ${createdVolunteers.length} volunteer users`);

        // Create NGO member users
        console.log("🏢 Creating NGO member users...");
        const ngoMembersWithVariations = addRandomVariations(ngoMembers);
        const createdNgoMembers = await User.insertMany(
            ngoMembersWithVariations
        );
        console.log(`✅ Created ${createdNgoMembers.length} NGO member users`);

        // Create donor users
        console.log("💰 Creating donor users...");
        const donorUsersWithVariations = addRandomVariations(donorUsers);
        const createdDonors = await User.insertMany(donorUsersWithVariations);
        console.log(`✅ Created ${createdDonors.length} donor users`);

        // Get all NGOs for creating relationships
        const ngos = await Ngo.find({}).populate("user");
        console.log(`📋 Found ${ngos.length} NGOs for creating relationships`);

        // Create user-NGO relationships for members
        console.log("🔗 Creating user-NGO relationships...");
        const relationships = [];

        // Associate NGO members with their respective NGOs
        for (const member of createdNgoMembers) {
            let targetNgo = null;

            // Match members to NGOs based on organization name
            if (member.organization?.name === "Little Lanterns") {
                targetNgo = ngos.find((ngo) => ngo.name === "Little Lanterns");
            } else if (member.organization?.name === "Aasha Sapne") {
                targetNgo = ngos.find((ngo) => ngo.name === "Aasha Sapne");
            } else if (member.organization?.name === "EarthNest") {
                targetNgo = ngos.find((ngo) => ngo.name === "EarthNest");
            } else if (member.organization?.name === "HerRise") {
                targetNgo = ngos.find((ngo) => ngo.name === "HerRise");
            } else if (member.organization?.name === "HealthFirst Initiative") {
                targetNgo = ngos.find(
                    (ngo) => ngo.name === "HealthFirst Initiative"
                );
            } else if (member.organization?.name === "Learning Bridge") {
                targetNgo = ngos.find((ngo) => ngo.name === "Learning Bridge");
            }

            if (targetNgo) {
                relationships.push({
                    user: member._id,
                    ngo: targetNgo._id,
                    relationshipType: ["member"],
                    permissions: ["view_dashboard", "create_task"],
                    joinedAt: new Date(
                        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
                    ), // Random join date within last year
                });
            }
        }

        // Associate some volunteers with NGOs randomly
        const shuffledVolunteers = [...createdVolunteers].sort(
            () => 0.5 - Math.random()
        );
        const volunteersToAssociate = shuffledVolunteers.slice(
            0,
            Math.min(6, shuffledVolunteers.length)
        );

        volunteersToAssociate.forEach((volunteer, index) => {
            const ngo = ngos[index % ngos.length]; // Distribute volunteers across NGOs
            relationships.push({
                user: volunteer._id,
                ngo: ngo._id,
                relationshipType: ["volunteer"],
                permissions: ["view_dashboard"],
                joinedAt: new Date(
                    Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
                ), // Random join date within last 6 months
            });
        });

        // Associate some donors with NGOs
        createdDonors.forEach((donor, index) => {
            const ngo = ngos[index % ngos.length];
            relationships.push({
                user: donor._id,
                ngo: ngo._id,
                relationshipType: ["donor"],
                permissions: ["view_donations"],
                joinedAt: new Date(
                    Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
                ), // Random join date within last 3 months
            });
        });

        // Create all relationships
        if (relationships.length > 0) {
            await UserNgoRelation.insertMany(relationships);
            console.log(
                `✅ Created ${relationships.length} user-NGO relationships`
            );
        }

        // Verification and summary
        console.log("📊 USERS SEEDING SUMMARY:");
        console.log("=".repeat(40));
        console.log(`👥 Total Volunteer Users: ${createdVolunteers.length}`);
        console.log(`🏢 Total NGO Member Users: ${createdNgoMembers.length}`);
        console.log(`💰 Total Donor Users: ${createdDonors.length}`);
        console.log(`🔗 Total Relationships Created: ${relationships.length}`);
        console.log(
            `📈 Total Users for Leaderboard: ${
                createdVolunteers.length + createdNgoMembers.length
            }`
        );

        // Show leaderboard preview
        console.log("\n🏆 LEADERBOARD PREVIEW (Top 5):");
        const allActiveUsers = [...createdVolunteers, ...createdNgoMembers]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        allActiveUsers.forEach((user, index) => {
            console.log(
                `   ${index + 1}. ${user.userName} - ${user.score} points (${
                    user.leaderboardStats.level
                })`
            );
        });

        console.log("\n🎯 SKILL DISTRIBUTION:");
        const volunteerTypes = {};
        createdVolunteers.forEach((user) => {
            const type = user.volunteerType || "General";
            volunteerTypes[type] = (volunteerTypes[type] || 0) + 1;
        });
        Object.entries(volunteerTypes).forEach(([type, count]) => {
            console.log(`   • ${type}: ${count} volunteers`);
        });

        console.log("\n🌍 LOCATION DISTRIBUTION:");
        const locationStats = {};
        [...createdVolunteers, ...createdNgoMembers].forEach((user) => {
            const city = user.location?.city || "Unknown";
            locationStats[city] = (locationStats[city] || 0) + 1;
        });
        Object.entries(locationStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .forEach(([city, count]) => {
                console.log(`   • ${city}: ${count} users`);
            });

        return {
            volunteers: createdVolunteers,
            ngoMembers: createdNgoMembers,
            donors: createdDonors,
            relationships: relationships,
        };
    } catch (error) {
        console.error("❌ Error creating users:", error);
        throw error;
    }
}

const seedUsers = async (keepConnectionOpen = false) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("🔗 Connected to database");
        }

        const result = await createUsersAndRelations();

        console.log("🎉 Successfully created all users and relationships!");

        if (!keepConnectionOpen) {
            console.log("🔒 Closing database connection...");
            await mongoose.connection.close();
            console.log("✅ Database connection closed");
        }

        return result;
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        throw error;
    }
};

if (require.main === module) {
    seedUsers()
        .then(() => {
            console.log("🏁 User seeding completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 User seeding failed:", error);
            process.exit(1);
        });
}

module.exports = { seedUsers };
