const mongoose = require("../../database");

// Create Wallet Operations Schema

const walletOperationsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid User ID"
        }
    },
    type: {
        type: String,
        required: [true, "Operation type is required"],
        enum: {
            values: ["deposit", "withdraw"],
            message: "Operation type must be either 'deposit' or 'withdraw'"
        }
    },
    operationNumber: {
        type: Number,
        required: [true, "Operation number is required"],
        min: [1, "Operation number must be greater than 0"],
        validate: {
            validator: Number.isInteger,
            message: "Operation number must be an integer"
        }
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"]
    }
}, { timestamps: true });

walletOperationsSchema.index({ userId: 1 });

walletOperationsSchema.index({ type: 1 });

walletOperationsSchema.index({ operationNumber: 1 });

walletOperationsSchema.index({ createdAt: -1 });

// Create Wallet Operations Model From Wallet Operations Schema

const walletOperationsModel = mongoose.model("wallet_operations", walletOperationsSchema);

module.exports = walletOperationsModel;