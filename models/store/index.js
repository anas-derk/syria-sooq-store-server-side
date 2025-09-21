const mongoose = require("../../database");

const storeConstants = require("../../constants/stores");

const { CITIES } = require("../../constants/cites");

// Create Store Schema

const storeSchema = new mongoose.Schema({
    userId: {
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
        enum: CITIES,
    },
    category: {
        type: String,
        required: true,
        enum: storeConstants.STORE_CATEGORIES,
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
        default: storeConstants.DEFAULT_STORE_STATUS,
        enum: storeConstants.STORE_STATUS,
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
    isClosed: {
        type: Boolean,
        default: false,
    },
    isDeliverable: {
        type: Boolean,
        default: true,
    },
    workingHours: [
        {
            day: { type: String, enum: storeConstants.DAYS, required: true },
            openTime: {
                time: { type: String, default: "" },
                period: { type: String, enum: storeConstants.PERIODS, default: "" },
            },
            closeTime: {
                time: { type: String, default: "" },
                period: { type: String, enum: storeConstants.PERIODS, default: "" },
            },
        }
    ],
    verificationStatus: {
        type: String,
        default: storeConstants.DEFAULT_STORE_VERIFICATION_STATUS,
        enum: storeConstants.STORE_VERIFICATION_STATUS,
    },
    verificationDate: Date,
    verificationRejectDate: Date,
    dateOfRejectVerification: Date,
    verificationRejectReason: String,
    dateOfCancelVerification: Date,
    verificationCancelReason: String,
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

module.exports = storeModel;