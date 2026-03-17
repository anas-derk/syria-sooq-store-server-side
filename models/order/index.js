const mongoose = require("../../database");

const counterModel = require("../../models/counter");

// Create Order Schema

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required"],
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: [true, "Store ID is required"],
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid store ID"
        }
    },
    totalPriceBeforeDiscount: {
        type: Number,
        default: 0,
        min: [0, "Price cannot be negative"]
    },
    totalDiscount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"]
    },
    totalPriceAfterDiscount: {
        type: Number,
        default: 0,
        min: [0, "Final price cannot be negative"]
    },
    orderAmount: {
        type: Number,
        default: 0,
        min: [0, "Order amount cannot be negative"]
    },
    orderType: {
        type: String,
        enum: ["normal", "fast"],
        default: "normal"
    },
    checkoutStatus: {
        type: String,
        enum: ["Checkout Incomplete", "Checkout Successfull"],
        default: function () {
            return this.orderType === "normal"
                ? "Checkout Incomplete"
                : "Checkout Successfull";
        }
    },
    paymentGateway: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["Wallet", "Credit Card", "Upon Receipt"]
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "shipping", "completed", "cancelled"]
    },
    products: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "product",
            required: [true, "Product ID is required"],
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: "Invalid product ID"
            }
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"]
        },
        message: {
            type: String,
            default: "",
            trim: true,
            maxlength: [500, "Message too long"]
        },
        name: {
            type: String,
            default: "none",
            trim: true
        },
        unitPrice: {
            type: Number,
            default: 0,
            min: [0, "Price cannot be negative"]
        },
        unitDiscount: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"]
        },
        imagePath: {
            type: String,
            default: "none",
            trim: true
        },
        extraData: {
            customText: {
                type: String,
                default: "",
                trim: true,
                maxlength: [500, "Custom text cannot exceed 500 characters"]
            },
            additionalNotes: {
                type: String,
                default: "",
                trim: true,
                maxlength: [1000, "Additional notes cannot exceed 1000 characters"]
            },
            additionalFiles: {
                type: [String],
                default: [],
                validate: {
                    validator: function (arr) {
                        if (!Array.isArray(arr)) return false;
                        if (arr.length > 10) return false;
                        return arr.every(file =>
                            typeof file === "string" &&
                            file.trim() !== "" &&
                            file.length <= 300
                        );
                    },
                    message: "Invalid additional files (max 10 files, each must be a valid non-empty string)"
                }
            }
        }
    }],
    orderNumber: {
        type: Number,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        enum: {
            values: [
                "lattakia", "tartus", "homs", "hama", "idleb", "daraa",
                "suwayda", "deer-alzoor", "raqqa", "hasakah",
                "damascus", "rif-damascus", "aleppo", "quneitra"
            ],
            message: props => `${props.value} is not a supported city`
        }
    },
    addressDetails: {
        type: String,
        required: [true, "Address details are required"],
        trim: true,
        minlength: [5, "Address details must be at least 5 characters"],
        maxlength: [300, "Address details cannot exceed 300 characters"],
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0;
            },
            message: "Address details cannot be empty"
        }
    },
    closestPoint: {
        type: String,
        default: "",
        trim: true,
        maxlength: [200, "Closest point cannot exceed 200 characters"],
        validate: {
            validator: function (v) {
                if (!v) return true;
                return v.trim().length > 0;
            },
            message: "Closest point cannot be empty if provided"
        }
    },
    additionalAddressDetails: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Additional address details cannot exceed 500 characters"],
        validate: {
            validator: function (v) {
                if (!v) return true;
                return v.trim().length > 0;
            },
            message: "Additional address details cannot be empty if provided"
        }
    },
    floorNumber: {
        type: Number,
        required: [true, "Floor number is required"],
        min: [0, "Floor number cannot be negative"],
        max: [200, "Floor number cannot exceed 200"],
        validate: {
            validator: function (v) {
                return Number.isInteger(v);
            },
            message: "Floor number must be an integer"
        }
    },
    additionalNotes: {
        type: String,
        default: "",
        trim: true,
        maxlength: [1000, "Additional notes cannot exceed 1000 characters"],
        validate: {
            validator: function (v) {
                if (!v) return true;
                return v.trim().length > 0;
            },
            message: "Additional notes cannot be empty if provided"
        }
    },
    mobilePhone: {
        type: String,
        required: [true, "Mobile phone is required"],
        trim: true,
        validate: {
            validator: v => /^[+0-9]{6,20}$/.test(v),
            message: "Invalid mobile phone"
        }
    },
    backupMobilePhone: {
        type: String,
        default: "",
        validate: {
            validator: function (v) {
                if (!v) return true;
                return /^[+0-9]{6,20}$/.test(v);
            },
            message: "Invalid backup phone"
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Invalid email"
        }
    },
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
    shippingCost: {
        type: Number,
        default: 0,
        min: [0, "Shipping cannot be negative"]
    },
    isReturned: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    addedDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (v) {
                // يسمح بالقيم الفارغة لأن default موجود
                if (!v) return true;
                return !isNaN(new Date(v).getTime());
            },
            message: "Added date must be a valid date"
        }
    }
}, { timestamps: true });

orderSchema.index({ userId: 1 });

orderSchema.index({ storeId: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ status: 1 });

orderSchema.index({ orderNumber: 1 }, { unique: true });

orderSchema.pre("save", async function (next) {
    if (!this.isNew) return next();
    const counter = await counterModel.findOneAndUpdate(
        { name: "orderNumber" },
        [
            {
                $set: {
                    seq: {
                        $cond: [
                            { $ifNull: ["$seq", false] },
                            { $add: ["$seq", 1] },
                            600000
                        ]
                    }
                }
            }
        ],
        { new: true, upsert: true }
    );
    this.orderNumber = counter.seq;
    next();
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;