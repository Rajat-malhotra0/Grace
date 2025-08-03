const mongoose = require("mongoose");

async function connectDB() {
    try {
        // useing this for seeding data
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
