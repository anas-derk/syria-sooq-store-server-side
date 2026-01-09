const mongoose = require("../../database");

const counterModel = require("../../models/counter");

// Create Return Order Schema

const returnOrderSchema = new mongoose.Schema({
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
    originalOrder: {
        type: mongoose.Types.ObjectId,
        ref: "order",
        required: true,
    },
    totalPriceBeforeDiscount: {
        type: Number,
        required: true,
    },
    totalDiscount: {
        type: Number,
        required: true,
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true,
    },
    orderAmount: {
        type: Number,
        required: true,
    },
    approvedTotalPriceBeforeDiscount: {
        type: Number,
        default: 0,
    },
    approvedTotalDiscount: {
        type: Number,
        default: 0,
    },
    approvedTotalPriceAfterDiscount: {
        type: Number,
        default: 0,
    },
    approvedOrderAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "awaiting products",
        enum: [
            "awaiting products",
            "received products",
            "checking products",
            "partially return products",
            "fully return products",
            "return refused"
        ]
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        unitDiscount: {
            type: Number,
            default: 0,
        },
        approvedQuantity: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            default: "",
        },
        imagePath: {
            type: String,
            required: true,
        },
        returnReason: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "checking",
            enum: [
                "checking",
                "full approval",
                "partial approval",
                "reject",
            ],
        }
    }],
    addedDate: {
        type: Date,
        default: Date.now,
    },
    orderNumber: Number,
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

returnOrderSchema.pre("save", async function (next) {
    if (!this.isNew) return next();
    const counter = await counterModel.findOneAndUpdate(
        { name: "returnOrderNumber" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    this.orderNumber = counter.seq;
    next();
});

// Create Return Order Model From Return Order Schema

const returnOrderModel = mongoose.model("return_order", returnOrderSchema);

module.exports = returnOrderModel;