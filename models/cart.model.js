const mongoose = require("../database");

// Create Cart Schema

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    message: {
        type: String,
        default: "",
    },
    customText: {
        type: String,
        default: "",
    },
    additionalNotes: {
        type: String,
        default: "",
    },
    additionalFiles: [String]
});

// Create Card Model From Cart Schema

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;