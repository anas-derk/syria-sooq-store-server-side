const mongoose = require("../../database");

// Create Favorite Product Schema

const favoriteProductShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

// Create Favorite Product Model From Favorite Product Schema

const favoriteProductModel = mongoose.model("favorite_products", favoriteProductShema);

module.exports = favoriteProductModel;