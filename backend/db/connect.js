const mongoose = require("mongoose");

async function connectDB() {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return;
        }
        
        await mongoose.connect("mongodb://localhost:27017/Grace");
        console.log("db connected");
    } catch (err) {
        console.log("error: ", err);
        throw err;
    }
}

module.exports = connectDB;
