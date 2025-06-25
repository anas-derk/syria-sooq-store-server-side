const mongoose = require("../database");

// Create Wallet Operations Schema

const walletOperationsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["deposit", "withdraw"]
    },
    operationNumber: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

// Create Wallet Operations Model From Wallet Operations Schema

const walletOperationsModel = mongoose.model("wallet_operations", walletOperationsSchema);

module.exports = walletOperationsModel;