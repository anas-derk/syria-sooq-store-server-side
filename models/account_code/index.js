const mongoose = require("../../database");

const verificationCodeConstants = require("../../constants/verification_code");

// Create Verification Code Schema

const verificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [
            function () {
                return !this.mobilePhone;
            },
            "Email is required when mobilePhone is not provided"
        ],
        validate: {
            validator: function (v) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Invalid email format"
        }
    },
    mobilePhone: {
        type: String,
        trim: true,
        required: [
            function () {
                return !this.email;
            },
            "Mobile phone is required when email is not provided"
        ],
        validate: {
            validator: function (v) {
                return !v || /^[+0-9]{6,20}$/.test(v);
            },
            message: "Invalid mobile phone format"
        }
    },
    code: {
        type: String,
        required: [true, "Verification code is required"],
        minlength: [20, "Invalid hashed code"],
        trim: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid createdDate"
        }
    },
    expirationDate: {
        type: Date,
        required: [true, "Expiration date is required"],
        validate: {
            validator: function (v) {
                if (!v || isNaN(new Date(v).getTime())) return false;
                const created = this.createdDate || new Date();
                const diff = v.getTime() - new Date(created).getTime();
                const MAX_EXPIRATION_MS = 24 * 60 * 60 * 1000;
                return diff > 0 && diff <= MAX_EXPIRATION_MS;
            },
            message: "Expiration date must be a valid future date and within allowed range"
        }
    },
    requestTimeCount: {
        type: Number,
        default: 1,
        min: [1, "Request count must be at least 1"],
        max: [100, "Request count exceeded limit"]
    },
    isBlockingFromReceiveTheCode: {
        type: Boolean,
        default: false
    },
    receiveBlockingExpirationDate: {
        type: Date,
        validate: {
            validator: function (v) {
                if (!this.isBlockingFromReceiveTheCode) return true;
                return v && v > new Date();
            },
            message: "Blocking expiration date must be valid and in the future"
        }
    },
    typeOfUse: {
        type: String,
        required: [true, "Type of use is required"],
        enum: {
            values: verificationCodeConstants.TYPES_OF_USE_VERIFICATION_CODE,
            message: "Invalid type of use"
        },
        default: verificationCodeConstants.DEFAULT_TYPE_OF_USE_VERIFICATION_CODE,
        trim: true
    }
}, { timestamps: true });

verificationCodeSchema.pre("save", function (next) {
    this.isBlockingFromReceiveTheCode = this.requestTimeCount >= 5;
    if (this.isBlockingFromReceiveTheCode && !this.receiveBlockingExpirationDate) {
        const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000;
        this.receiveBlockingExpirationDate = new Date(Date.now() + BLOCK_DURATION_MS);
    }
    next();
});

verificationCodeSchema.index({ email: 1 });

verificationCodeSchema.index({ mobilePhone: 1 });

verificationCodeSchema.index({ typeOfUse: 1 });

verificationCodeSchema.index({
    email: 1,
    typeOfUse: 1,
    createdAt: -1
});

verificationCodeSchema.index({
    mobilePhone: 1,
    typeOfUse: 1,
    createdAt: -1
});

// Create Verification Code Model From Verification Code Schema

const verificationCodeModel = mongoose.model("verification_codes", verificationCodeSchema);

module.exports = verificationCodeModel;