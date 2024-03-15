const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/social_app');
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};
module.exports = connect;
