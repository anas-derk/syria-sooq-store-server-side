const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../.env"),
});

const storeConstants = require("../../constants/stores");

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

const storeInfo = {
    userId: "674f61fc74fbe8e7d7355c07",
    name: "Syria Sooq",
    city: "lattakia",
    category: "any",
    headquarterAddress: "Lattakia, Alzeraa",
    taxNumber: "1234",
    ownerFullName: "Ahmad Hussein",
    phoneNumber: "0941519404",
    email: process.env.MAIN_ADMIN_EMAIL,
    bankAccountInformation: "Test Bank Info",
    coverImagePath: "assets/images/stores/StoreLogo.png",
    profileImagePath: "assets/images/stores/StoreLogo.png",
    commercialRegisterFilePath: "assets/images/stores/StoreLogo.png",
    taxCardFilePath: "assets/images/stores/StoreLogo.png",
    addressProofFilePath: "assets/images/stores/StoreLogo.png",
    isApproved: true,
    status: "approving",
    isMainStore: true,
    approveDate: Date.now(),
    workingHours: [
        {
            "day": "saturday",
            "openTime": { "time": "12:00", "period": "AM" },
            "closeTime": { "time": "12:00", "period": "AM" }
        },
        {
            "day": "sunday",
            "openTime": { "time": "09:00", "period": "AM" },
            "closeTime": { "time": "06:00", "period": "PM" }
        },
        {
            "day": "monday",
            "openTime": { "time": "09:00", "period": "AM" },
            "closeTime": { "time": "06:00", "period": "PM" }
        },
        {
            "day": "tuesday",
            "openTime": { "time": "09:00", "period": "AM" },
            "closeTime": { "time": "06:00", "period": "PM" }
        },
        {
            "day": "wednesday",
            "openTime": { "time": "09:00", "period": "AM" },
            "closeTime": { "time": "06:00", "period": "PM" }
        },
        {
            "day": "thursday",
            "openTime": { "time": "09:00", "period": "AM" },
            "closeTime": { "time": "06:00", "period": "PM" }
        },
        {
            "day": "friday",
            "openTime": { "time": "", "period": "AM" },
            "closeTime": { "time": "", "period": "PM" }
        }
    ],
    verificationStatus: "approving",
    verificationDate: Date.now()
};

async function create_initial_store() {
    try {
        await mongoose.connect(process.env.DB_URL);
        await (new storeModel(storeInfo)).save();
        await mongoose.disconnect();
        return "Ok !!, Create Initial Store Process Has Been Successfuly !!";
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_store()
    .then((result) => { console.log(result); process.exit(1); })
    .catch((err) => console.log(err.message));