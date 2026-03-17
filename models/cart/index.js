const mongoose = require("../../database");

// Create Cart Schema

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: [true, "Product reference is required"],
        validate: {
            validator: function (v) {
                if (!v) return false;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid product ID"
        }
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be at least 1"]
    },
    message: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Message cannot exceed 500 characters"]
    },
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
                return arr.every(f => typeof f === "string" && f.trim() !== "");
            },
            message: "All additional files must be non-empty strings"
        }
    }
}, { timestamps: true });

cartSchema.index({ userId: 1 });

cartSchema.index({ product: 1 });

cartSchema.index({ userId: 1, product: 1 });

// Create Card Model From Cart Schema

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;