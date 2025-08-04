const mongoose = require("mongoose");
const connectDB = require("./connect");

async function testConnection() {
    try {
        console.log("🧪 Testing database connection...");

        await connectDB();
        console.log("✅ Database connection successful!");

        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();
        console.log(`📊 Found ${collections.length} collections in database`);

        await mongoose.connection.close();
        console.log("🔒 Connection closed successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        console.log("\n💡 Make sure MongoDB is running:");
        console.log("   • Windows: Start MongoDB service");
        console.log(
            "   • Mac/Linux: Run 'mongod' or 'brew services start mongodb-community'"
        );
        process.exit(1);
    }
}

if (require.main === module) {
    testConnection()
        .then(() => {
            console.log("\n🎉 Database test completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Test failed:", error);
            process.exit(1);
        });
}

module.exports = { testConnection };
