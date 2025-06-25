const mongoose = require("../database");

// Create Store Schema

const storeSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
    },
    coverImagePath: {
        type: String,
        required: true,
    },
    profileImagePath: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
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
    category: {
        type: String,
        required: true,
    },
    headquarterAddress: {
        type: String,
        required: true,
    },
    taxNumber: {
        type: String,
        required: true,
    },
    ownerFullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bankAccountInformation: {
        type: String,
        required: true,
    },
    commercialRegisterFilePath: {
        type: String,
        required: true,
    },
    taxCardFilePath: {
        type: String,
        required: true,
    },
    addressProofFilePath: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "approving",
            "rejecting",
            "blocking",
        ],
    },
    isMainStore: Boolean,
    creatingOrderDate: {
        type: Date,
        default: Date.now,
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
    blockingReason: String,
    ratings: {
        type: Object,
        default: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

module.exports = storeModel;