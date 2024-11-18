const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// Create Store Schema

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    ownerFirstName: {
        type: String,
        required: true,
    },
    ownerLastName: {
        type: String,
        required: true,
    },
    ownerEmail: {
        type: String,
        required: true,
    },
    productsType: {
        type: String,
        required: true,
    },
    productsDescription: {
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
    language: {
        type: String,
        enum: [
            "ar",
            "en",
        ],
        default: "en"
    },
    creatingOrderDate: {
        type: Date,
        default: Date.now(),
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

const storeInfo = {
    name: "Syria Sooq",
    imagePath: "assets/images/stores/syria-sooq.jpg",
    ownerFirstName: "Ahmad",
    ownerLastName: "Hussein",
    ownerEmail: process.env.MAIN_ADMIN_EMAIL,
    isApproved: true,
    productsType: "Multiple",
    productsDescription: "Welcome To Syria Sooq Store",
    status: "approving",
    isMainStore: true,
    approveDate: Date.now(),
};

async function create_initial_store() {
    try {
        await mongoose.connect(process.env.DB_URL);
        const newStore = new storeModel(storeInfo);
        await newStore.save();
        await mongoose.disconnect();
        return "Ok !!, Create Initial Store Process Has Been Successfuly !!";
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_store().then((result) => console.log(result));