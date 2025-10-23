const mongoose = require("mongoose");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/Grace";

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const mongoUri = (process.env.MONGODB_URI || DEFAULT_URI).trim();

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not configured");
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connected successfully");
        return mongoose.connection;
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
}

module.exports = connectDB;
