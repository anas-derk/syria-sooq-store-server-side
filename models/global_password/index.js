const mongoose = require("../../database");

// Create Global Password Schema

const globalPasswordSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

module.exports = globalPasswordModel;