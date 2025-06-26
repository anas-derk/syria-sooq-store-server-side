const mongoose = require("../../database");

// Create Brand Schema

const brandSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    }
});

// Create Brand Model From Brand Schema

const brandModel = mongoose.model("brand", brandSchema);

module.exports = brandModel;