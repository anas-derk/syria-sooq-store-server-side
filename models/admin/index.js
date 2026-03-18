const mongoose = require("../../database");

const { PERMISSIONS } = require("../../constants/admins");

// Create Admin Schema

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [3, "Full name must be at least 3 characters"],
        maxlength: [50, "Full name cannot exceed 50 characters"],
        validate: {
            validator: function (v) {
                // يقبل العربي والإنجليزي ومسافة فقط
                return /^[\u0600-\u06FFa-zA-Z\s]+$/.test(v);
            },
            message: "Full name must contain only letters and spaces"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [128, "Password cannot exceed 128 characters"]
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false
    },
    isMerchant: {
        type: Boolean,
        default: false
    },
    storeId: {
        type: String,
        required: [true, "Store ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid store ID"
        }
    },
    permissions: {
        type: [
            {
                name: {
                    type: String,
                    required: [true, "Permission name is required"],
                    enum: PERMISSIONS
                },
                value: {
                    type: Boolean,
                    required: [true, "Permission value is required"]
                }
            }
        ],
        required: [true, "Permissions are required"]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockingReason: {
        type: String,
        required: [
            function () {
                return this.isBlocked;
            },
            "Blocking reason is required when admin is blocked"
        ],
        trim: true
    },
    creatingDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid creating date"
        }
    },
    blockingDate: {
        type: Date,
        required: [
            function () {
                return this.isBlocked;
            },
            "Blocking date is required when admin is blocked"
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
    }
}, { timestamps: true });

adminSchema.index({ fullName: 1 });

adminSchema.index({ email: 1 }, { unique: true });

adminSchema.index({ isMerchant: 1 });

adminSchema.index({ storeId: 1 });

adminSchema.index({ isBlocked: 1 });

adminSchema.index({ creatingDate: -1 });

// Create Admin Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;