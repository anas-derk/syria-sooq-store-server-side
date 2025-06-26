const mongoose = require("../../database");

// Create Products Wallet Schema

const productsWalletShema = new mongoose.Schema({
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

// Create Products Wallet Model From Products Wallet Schema

const productsWalletModel = mongoose.model("products_wallet", productsWalletShema);

module.exports = productsWalletModel;