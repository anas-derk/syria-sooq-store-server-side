const mongoose = require("../../database");

const storeConstants = require("../../constants/stores");

const { CITIES } = require("../../constants/cites");

// Create Store Schema

const storeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    },
    coverImagePath: {
        type: String,
        required: [true, "Cover image path is required"],
        trim: true
    },
    profileImagePath: {
        type: String,
        required: [true, "Profile image path is required"],
        trim: true
    },
    name: {
        type: String,
        required: [true, "Store name is required"],
        trim: true,
        minlength: [2, "Store name must be at least 2 characters"],
        maxlength: [100, "Store name cannot exceed 100 characters"]
    },
    city: {
        type: String,
        required: [true, "City is required"],
        enum: {
            values: CITIES,
            message: "Invalid city"
        },
        trim: true
    },
    category: {
        type: String,
        required: [true, "Store category is required"],
        enum: {
            values: storeConstants.STORE_CATEGORIES,
            message: "Invalid store category"
        },
        trim: true
    },
    headquarterAddress: {
        type: String,
        required: [true, "Headquarter address is required"],
        trim: true,
        minlength: [5, "Headquarter address must be at least 5 characters"],
        maxlength: [200, "Headquarter address cannot exceed 200 characters"]
    },
    taxNumber: {
        type: String,
        required: [true, "Tax number is required"],
        trim: true,
        minlength: [5, "Tax number must be at least 5 characters"],
        maxlength: [50, "Tax number cannot exceed 50 characters"]
    },
    ownerFullName: {
        type: String,
        required: [true, "Owner full name is required"],
        trim: true,
        minlength: [3, "Owner full name must be at least 3 characters"],
        maxlength: [100, "Owner full name cannot exceed 100 characters"],
        validate: {
            validator: function (v) {
                return /^[\p{L}\s]+$/u.test(v);
            },
            message: "Owner full name must contain only letters and spaces"
        }
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        validate: {
            validator: v => /^[+0-9]{6,20}$/.test(v),
            message: "Invalid phone number format"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: "Invalid email format"
        }
    },
    bankAccountInformation: {
        type: String,
        required: [true, "Bank account information is required"],
        trim: true,
        minlength: [5, "Bank account information must be at least 5 characters"],
        maxlength: [100, "Bank account information cannot exceed 100 characters"]
    },
    commercialRegisterFilePath: {
        type: String,
        required: [true, "Commercial register file path is required"],
        trim: true
    },
    taxCardFilePath: {
        type: String,
        required: [true, "Tax card file path is required"],
        trim: true
    },
    addressProofFilePath: {
        type: String,
        required: [true, "Address proof file path is required"],
        trim: true
    },
    status: {
        type: String,
        default: storeConstants.DEFAULT_STORE_STATUS,
        enum: {
            values: storeConstants.STORE_STATUS,
            message: "Invalid store status"
        },
        trim: true
    },
    isMainStore: {
        type: Boolean,
        default: false
    },
    creatingOrderDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !isNaN(new Date(v).getTime()),
            message: "Invalid creating order date"
        }
    },
    approveDate: {
        type: Date,
        required: [
            function () {
                return this.status === "approving";
            }, "Approve Date Required When Status: approving"
        ],
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid approve date"
        }
    },
    blockingDate: {
        type: Date,
        required: [
            function () {
                return this.status === "blocking";
            }, "Blocking Date Required When Status: blocking"
        ],
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid blocking date"
        }
    },
    dateOfCancelBlocking: {
        type: Date,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid cancel blocking date"
        }
    },
    blockingReason: {
        type: String,
        required: [
            function () {
                return this.status === "blocking";
            }, "Blocking Reason Required When Status: blocking"
        ],
        trim: true,
        minlength: [5, "Blocking reason must be at least 5 characters"],
        maxlength: [200, "Blocking reason cannot exceed 200 characters"]
    },
    ratings: {
        type: Object,
        default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    isDeliverable: {
        type: Boolean,
        default: true
    },
    workingHours: [{
        day: {
            type: String,
            required: [true, "Day is required"],
            enum: {
                values: storeConstants.DAYS,
                message: "Invalid day"
            },
            trim: true
        },
        openTime: {
            time: { type: String, default: "", trim: true },
            period: {
                type: String,
                default: "",
                enum: {
                    values: storeConstants.PERIODS,
                    message: "Invalid open period"
                },
                trim: true
            }
        },
        closeTime: {
            time: { type: String, default: "", trim: true },
            period: {
                type: String,
                default: "",
                enum: {
                    values: storeConstants.PERIODS,
                    message: "Invalid close period"
                },
                trim: true
            }
        }
    }],
    verificationStatus: {
        type: String,
        default: storeConstants.DEFAULT_STORE_VERIFICATION_STATUS,
        enum: {
            values: storeConstants.STORE_VERIFICATION_STATUS,
            message: "Invalid store verification status"
        },
        trim: true
    },
    verificationDate: {
        type: Date,
        required: [
            function () {
                return this.verificationStatus === "approving";
            }, "Verification Date Required When Status: approving"
        ],
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid verification date"
        }
    },
    verificationRejectDate: {
        type: Date,
        required: [
            function () {
                return this.verificationStatus === "rejecting";
            }, "Verification Reject Date Required When Status: rejecting"
        ],
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid verification reject date"
        }
    },
    dateOfRejectVerification: {
        type: Date,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid date of reject verification"
        }
    },
    verificationRejectReason: {
        type: String,
        trim: true,
        required: [
            function () {
                return this.verificationStatus === "rejecting";
            }, "Verification Reject Reason Required When Status: rejecting"
        ],
        minlength: [5, "Verification reject reason must be at least 5 characters"],
        maxlength: [200, "Verification reject reason cannot exceed 200 characters"]
    },
    dateOfCancelVerification: {
        type: Date,
        required: [
            function () {
                return this.verificationStatus === "cancel-approving";
            }, "date Of Cancel Verification Required When Status: cancel-approving"
        ],
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid date of cancel verification"
        }
    },
    verificationCancelReason: {
        type: String,
        trim: true,
        required: [
            function () {
                return this.verificationStatus === "cancel-approving";
            }, "Verification Cancel Reason Required When Status: cancel-approving"
        ],
        minlength: [5, "Verification cancel reason must be at least 5 characters"],
        maxlength: [200, "Verification cancel reason cannot exceed 200 characters"]
    },
}, { timestamps: true });

storeSchema.index({ userId: 1 });

storeSchema.index({ status: 1 });

storeSchema.index({ city: 1 });

storeSchema.index({ category: 1 });

storeSchema.index({ isMainStore: 1 });

storeSchema.index({ isClosed: 1 });

storeSchema.index({ isDeliverable: 1 });

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

module.exports = storeModel;