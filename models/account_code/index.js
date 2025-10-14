const mongoose = require("../../database");

const verificationCodeConstants = require("../../constants/verification_code");

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
        default: verificationCodeConstants.DEFAULT_TYPE_OF_USE_VERIFICATION_CODE,
        enum: verificationCodeConstants.TYPES_OF_USE_VERIFICATION_CODE,
    }
});

// Create Verification Code Model From Verification Code Schema

const verificationCodeModel = mongoose.model("verification_codes", verificationCodeShema);

module.exports = verificationCodeModel;