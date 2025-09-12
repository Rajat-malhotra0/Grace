const mongoose = require("mongoose");
const NGO = require("./models/ngo");
const User = require("./models/user");

// Connect to database
mongoose.connect("mongodb://localhost:27017/grace", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function checkNGOs() {
    try {
        console.log("=== NGO Verification Check ===");

        // Check all NGOs
        const allNgos = await NGO.find({}).populate("user", "userName email");
        console.log(`Total NGOs in database: ${allNgos.length}`);

        // Check verified NGOs
        const verifiedNgos = await NGO.find({ isVerified: true }).populate(
            "user",
            "userName email"
        );
        console.log(`Verified NGOs: ${verifiedNgos.length}`);

        // Check unverified NGOs
        const unverifiedNgos = await NGO.find({ isVerified: false }).populate(
            "user",
            "userName email"
        );
        console.log(`Unverified NGOs: ${unverifiedNgos.length}`);

        console.log("\n=== Unverified NGO Details ===");
        unverifiedNgos.forEach((ngo, index) => {
            console.log(`${index + 1}. Name: ${ngo.name}`);
            console.log(
                `   User: ${ngo.user?.userName || "N/A"} (${
                    ngo.user?.email || "N/A"
                })`
            );
            console.log(`   Verified: ${ngo.isVerified}`);
            console.log(`   Active: ${ngo.isActive}`);
            console.log(`   Created: ${ngo.createdAt}`);
            console.log("---");
        });

        // Check admin users
        const adminUsers = await User.find({ role: "admin" });
        console.log(`\n=== Admin Users ===`);
        console.log(`Total admin users: ${adminUsers.length}`);
        adminUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.userName} (${user.email})`);
        });
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

checkNGOs();
