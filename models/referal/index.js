const mongoose = require("../../database");

// Create Referal Schema

const referalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [1, "Name cannot be empty"],
        maxlength: [200, "Name is too long"],
        validate: {
            validator: function (v) {
                // يقبل العربي والإنجليزي فقط، بدون أرقام أو محارف خاصة
                return /^[\u0600-\u06FFa-zA-Z\s]+$/.test(v);
            },
            message: "Name must contain only letters (Arabic or English)"
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
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        minlength: [1, "Content cannot be empty"],
        maxlength: [1000, "Content cannot exceed 1000 characters"]
    },
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
    referalDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (v) {
                return !isNaN(new Date(v).getTime());
            },
            message: "Invalid referal date"
        }
    },
    isAppeared: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

referalSchema.index({ name: 1 });

referalSchema.index({ email: 1 });

referalSchema.index({ productId: 1 });

referalSchema.index({ referalDate: -1 });

// Create Referal Model From Referal Schema

const referalModel = mongoose.model("referal", referalSchema);

module.exports = referalModel;