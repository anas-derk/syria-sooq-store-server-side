const mongoose = require("../../database");

const counterModel = require("../../models/counter");

const { DEFAULT_RETRUN_ORDER_STATUS, RETRUN_ORDER_STATUS, DEFAULT_RETRUN_ORDER_PRODUCT_STATUS, RETRUN_ORDER_PRODUCT_STATUS } = require("../../constants/orders");

// Create Return Order Schema

const returnOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "User ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Store ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid store ID"
        }
    },
    originalOrder: {
        type: mongoose.Types.ObjectId,
        required: [true, "Original order ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid original order ID"
        }
    },
    totalPriceBeforeDiscount: {
        type: Number,
        required: [true, "Total price before discount is required"],
        min: [0, "Total price before discount cannot be negative"]
    },
    totalDiscount: {
        type: Number,
        required: [true, "Total discount is required"],
        min: [0, "Total discount cannot be negative"]
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: [true, "Total price after discount is required"],
        min: [0, "Total price after discount cannot be negative"]
    },
    orderAmount: {
        type: Number,
        required: [true, "Order amount is required"],
        min: [0, "Order amount cannot be negative"]
    },
    approvedTotalPriceBeforeDiscount: {
        type: Number,
        default: 0,
        min: [0, "Approved total price before discount cannot be negative"]
    },
    approvedTotalDiscount: {
        type: Number,
        default: 0,
        min: [0, "Approved total discount cannot be negative"]
    },
    approvedTotalPriceAfterDiscount: {
        type: Number,
        default: 0,
        min: [0, "Approved total price after discount cannot be negative"]
    },
    approvedOrderAmount: {
        type: Number,
        default: 0,
        min: [0, "Approved order amount cannot be negative"]
    },
    status: {
        type: String,
        default: DEFAULT_RETRUN_ORDER_STATUS,
        enum: {
            values: RETRUN_ORDER_STATUS,
            message: "Invalid return order status"
        },
        trim: true
    },
    products: [{
        productId: {
            type: String,
            required: [true, "Product ID is required"],
            trim: true,
            validate: {
                validator: function (v) {
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: "Invalid product ID"
            }
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"]
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name cannot exceed 200 characters"]
        },
        unitPrice: {
            type: Number,
            required: [true, "Unit price is required"],
            min: [0, "Unit price cannot be negative"]
        },
        unitDiscount: {
            type: Number,
            default: 0,
            min: [0, "Unit discount cannot be negative"]
        },
        approvedQuantity: {
            type: Number,
            default: 0,
            min: [0, "Approved quantity cannot be negative"]
        },
        notes: {
            type: String,
            default: "",
            trim: true,
            maxlength: [1000, "Notes cannot exceed 1000 characters"]
        },
        imagePath: {
            type: String,
            required: [true, "Image path is required"],
            trim: true
        },
        returnReason: {
            type: String,
            default: "",
            trim: true,
            maxlength: [500, "Return reason cannot exceed 500 characters"]
        },
        status: {
            type: String,
            default: DEFAULT_RETRUN_ORDER_PRODUCT_STATUS,
            enum: {
                values: RETRUN_ORDER_PRODUCT_STATUS,
                message: "Invalid product return status"
            },
            trim: true
        }
    }],
    addedDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !isNaN(new Date(v).getTime()),
            message: "Invalid added date"
        }
    },
    orderNumber: {
        type: Number,
        min: [0, "Order number cannot be negative"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

returnOrderSchema.index({ userId: 1 });

returnOrderSchema.index({ storeId: 1 });

returnOrderSchema.index({ originalOrder: 1 });

returnOrderSchema.index({ status: 1 });

returnOrderSchema.index({ "products.productId": 1 });

returnOrderSchema.index({ addedDate: -1 });

returnOrderSchema.index({ orderNumber: 1 });

returnOrderSchema.index({ isDeleted: 1 });

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