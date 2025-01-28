const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

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
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

const storeInfo = {
    userId: "674f61fc74fbe8e7d7355c07",
    name: "Syria Sooq",
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

create_initial_store().then((result) => console.log(result));