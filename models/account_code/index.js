const mongoose = require("../../database");

// Create Verification Code Schema

const verificationCodeShema = new mongoose.Schema({
    email: String,
    mobilePhone: String,
    code: {
        type: String,
        required: true,
    },
    createdDate: Date,
    expirationDate: {
        type: Date,
        required: true,
    },
    requestTimeCount: {
        type: Number,
        default: 1,
    },
    isBlockingFromReceiveTheCode: {
        type: Boolean,
        default: false,
    },
    receiveBlockingExpirationDate: Date,
    typeOfUse: {
        type: String,
        default: "to activate account",
        enum: [
            "to activate account",
            "to reset password",
        ],
    }
});

// Create Verification Code Model From Verification Code Schema

const verificationCodeModel = mongoose.model("verification_codes", verificationCodeShema);

module.exports = verificationCodeModel;