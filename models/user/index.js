const mongoose = require("../../database");

const { CITIES } = require("../../constants/cites");

const userConstants = require("../../constants/users");

// Create User Schema

const userSchema = new mongoose.Schema({
    registerationMethod: {
        type: String,
        enum: userConstants.REGISTERATION_METHOD,
        default: userConstants.DEFAULT_REGISTERATION_METHOD,
    },
    registerationAgent: {
        type: String,
        enum: userConstants.REGISTERATION_AGENT,
        default: userConstants.DEFAULT_REGISTERATION_AGENT,
    },
    city: {
        type: String,
        required: true,
        enum: CITIES,
    },
    email: String,
    mobilePhone: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: true,
    },
    fullName: {
        type: String,
        default: "",
    },
    addresses: {
        type: Array,
        default: [],
    },
    interests: {
        type: Array,
        default: [],
    },
    followedStores: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "store",
        }],
        default: [],
    },
    wallet: {
        fullDepositAmount: {
            type: Number,
            default: 0
        },
        fullWithdrawAmount: {
            type: Number,
            default: 0
        },
        remainingAmount: {
            type: Number,
            default: 0
        },
    },
    imagePath: {
        type: String,
        default: "",
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;