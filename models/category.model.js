const mongoose = require("../database");

// Create Category Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "categorie",
        default: null
    },
    imagePath: {
        type: String,
        required: true,
    },
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("categorie", categorySchema);

module.exports = categoryModel;