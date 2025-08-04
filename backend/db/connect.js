const mongoose = require("mongoose");

async function connectDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return;
        }

        await mongoose.connect("mongodb://localhost:27017/Grace");
        console.log("Database connected successfully");
    } catch (err) {
        console.log("Database connection error:", err);
        throw err;
    }
}

module.exports = connectDB;
