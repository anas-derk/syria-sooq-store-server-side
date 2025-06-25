const mongoose = require("../database");

// Create Referal Schema

const referalShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    referalDate: {
        type: Date,
        default: Date.now,
    },
    isAppeared: {
        type: Boolean,
        default: true,
    }
});

// Create Referal Model From Referal Schema

const referalModel = mongoose.model("referal", referalShema);

module.exports = referalModel;