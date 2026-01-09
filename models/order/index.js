const mongoose = require("../../database");

const counterModel = require("../../models/counter");

// Create Order Schema

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: true,
    },
    totalPriceBeforeDiscount: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    totalPriceAfterDiscount: {
        type: Number,
        default: 0,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    checkoutStatus: {
        type: String,
        default: this.orderType === "normal" ? "Checkout Incomplete" : "Checkout Successfull",
        enum: [
            "Checkout Incomplete",
            "Checkout Successfull"
        ],
    },
    paymentGateway: {
        type: String,
        required: true,
        enum: [
            "Wallet",
            "Credit Card",
            "Upon Receipt"
        ],
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "shipping",
            "completed",
            "cancelled"
        ]
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        message: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "none",
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        unitDiscount: {
            type: Number,
            default: 0,
        },
        imagePath: {
            type: String,
            default: "none",
        },
        extraData: {
            type: Map,
            default: {
                customText: {
                    type: String,
                    default: "",
                },
                additionalNotes: {
                    type: String,
                    default: "",
                },
                additionalNotes: {
                    type: [String],
                    default: [],
                },
            },
        }
    }],
    addedDate: {
        type: Date,
        default: Date.now,
    },
    orderNumber: Number,
    city: {
        type: String,
        required: true,
        enum: [
            "lattakia",
            "tartus",
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
            "raqqa",
            "hasakah",
            "damascus",
            "rif-damascus",
            "aleppo",
            "quneitra"
        ]
    },
    address: {
        type: String,
        required: true,
    },
    addressDetails: {
        type: String,
        required: true,
    },
    closestPoint: {
        type: String,
        default: "",
    },
    additionalAddressDetails: {
        type: String,
        default: "",
    },
    floorNumber: {
        type: Number,
        required: true,
    },
    additionalNotes: {
        type: String,
        default: "",
    },
    mobilePhone: {
        type: String,
        required: true,
    },
    backupMobilePhone: {
        type: String,
        default: "",
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    email: String,
    fullName: {
        type: String,
        required: true,
    },
});

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