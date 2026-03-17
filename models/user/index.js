const mongoose = require("../../database");

const { CITIES } = require("../../constants/cites");

const userConstants = require("../../constants/users");

// Create User Schema

const userSchema = new mongoose.Schema({
    registerationMethod: {
        type: String,
        enum: {
            values: userConstants.REGISTERATION_METHOD,
            message: "Invalid registration method"
        },
        default: userConstants.DEFAULT_REGISTERATION_METHOD
    },
    registerationAgent: {
        type: String,
        enum: {
            values: userConstants.REGISTERATION_AGENT,
            message: "Invalid registration agent"
        },
        default: userConstants.DEFAULT_REGISTERATION_AGENT
    },
    city: {
        type: String,
        required: [true, "City is required"],
        enum: {
            values: CITIES,
            message: "Invalid city"
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [function () { return !this.mobilePhone; }, "Email is required if mobile phone is not provided"],
        validate: {
            validator: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
            message: "Invalid email format"
        }
    },
    mobilePhone: {
        type: String,
        trim: true,
        required: [function () { return !this.email; }, "Mobile phone is required if email is not provided"],
        validate: {
            validator: function (v) { return !v || /^[+0-9]{6,20}$/.test(v); },
            message: "Invalid mobile phone format"
        }
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [128, "Password cannot exceed 128 characters"]
    },
    gender: {
        type: String,
        enum: {
            values: userConstants.GENDER,
            message: "Invalid gender"
        }
    },
    age: {
        type: Number,
        min: [0, "Age cannot be negative"],
        max: [120, "Age cannot exceed 120"],
        validate: {
            validator: function (v) {
                // السماح بأن يكون فارغ (undefined) أو قيمة صحيحة
                return v == null || Number.isInteger(v);
            },
            message: "Age must be an integer"
        }
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    fullName: {
        type: String,
        trim: true,
        default: "",
        minlength: [3, "Full name must be at least 3 characters"],
        maxlength: [100, "Full name cannot exceed 100 characters"],
        validate: {
            validator: function (v) {
                return /^[\p{L}\s]+$/u.test(v);
            },
            message: "Full name must contain only letters and spaces"
        },
    },
    addresses: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                return Array.isArray(arr) && arr.every(addr => typeof addr === "string" && addr.trim().length > 0);
            },
            message: "Each address must be a non-empty string"
        }
    },
    interests: {
        type: [mongoose.Types.ObjectId],
        ref: "categorie",
        default: [],
        validate: {
            validator: function (arr) {
                return Array.isArray(arr) && arr.every(id => mongoose.Types.ObjectId.isValid(id));
            },
            message: "Each interest must be a valid categorie ID"
        }
    },
    followedStores: {
        type: [mongoose.Types.ObjectId],
        ref: "store",
        default: [],
        validate: {
            validator: function (arr) {
                return Array.isArray(arr) && arr.every(id => mongoose.Types.ObjectId.isValid(id));
            },
            message: "Each followed store must be a valid store ID"
        }
    },
    wallet: {
        fullDepositAmount: { type: Number, default: 0, min: [0, "Deposit cannot be negative"] },
        fullWithdrawAmount: { type: Number, default: 0, min: [0, "Withdraw cannot be negative"] },
        remainingAmount: { type: Number, default: 0, min: [0, "Remaining amount cannot be negative"] }
    },
    imagePath: {
        type: String,
        default: ""
    },
    dateOfCreation: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid date of creation"
        }
    },
    notificationsToken: {
        type: String,
        trim: true,
        default: "",
        validate: {
            validator: v => !v || /^[a-zA-Z0-9\-_:]{20,255}$/.test(v),
            message: "Invalid FCM notifications token"
        }
    }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true, sparse: true });

userSchema.index({ mobilePhone: 1 }, { unique: true, sparse: true });

userSchema.index({ city: 1 });

userSchema.index({ followedStores: 1 });

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;