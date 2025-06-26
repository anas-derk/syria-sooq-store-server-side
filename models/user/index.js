const mongoose = require("../../database");

// Create User Schema

const userSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        enum: [
            "lattakia",
            "tartus",
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
            "raqqa",
            "hasakah",
            "damascus",
            "rif-damascus",
            "aleppo",
            "quneitra"
        ],
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