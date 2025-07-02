const mongoose = require("mongoose");

function connectDB() {
    mongoose
        .connect("mongodb://localhost:27017/Grace")
        .then(() => {
            console.log("db connected");
        })
        .catch((err) => {
            console.log("error: ", err);
        });
}

module.exports = connectDB;
