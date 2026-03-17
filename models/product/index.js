const mongoose = require("../../database");

const { GENDER_FOR_DASHBOARD } = require("../../constants/users");

// Create Product Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [2, "Product name must be at least 2 characters"],
        maxlength: [200, "Product name cannot exceed 200 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minlength: [5, "Description must be at least 5 characters"],
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    categories: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "categorie",
            validate: {
                validator: function (v) {
                    return !v || mongoose.Types.ObjectId.isValid(v);
                },
                message: "Invalid category ID"
            }
        }],
        default: []
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"]
    },
    discountInOfferPeriod: {
        type: Number,
        default: 0,
        min: [0, "Discount in offer period cannot be negative"]
    },
    offerDescription: {
        type: String,
        trim: true,
        maxlength: [500, "Offer description cannot exceed 500 characters"]
    },
    numberOfOrders: {
        type: Number,
        default: 0,
        min: [0, "Number of orders cannot be negative"]
    },
    quantity: {
        type: Number,
        default: 1,
        min: [0, "Quantity cannot be negative"]
    },
    isAvailableForDelivery: {
        type: Boolean,
        default: false
    },
    ratings: {
        type: Object,
        default: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },
    postOfDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid post date"
        }
    },
    imagePath: {
        type: String,
        required: [true, "Product image is required"],
        trim: true
    },
    galleryImagesPaths: {
        type: [String],
        default: [],
        validate: {
            validator: arr => arr.every(s => typeof s === "string" && s.trim() !== ""),
            message: "Gallery images must be valid non-empty strings"
        }
    },
    colorImagesPaths: {
        type: [String],
        default: [],
        validate: {
            validator: arr => arr.every(s => typeof s === "string" && s.trim() !== ""),
            message: "Color images must be valid non-empty strings"
        }
    },
    startDiscountPeriod: {
        type: Date,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid start discount date"
        }
    },
    endDiscountPeriod: {
        type: Date,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return !isNaN(new Date(v).getTime()) &&
                    (!this.startDiscountPeriod || v >= this.startDiscountPeriod);
            },
            message: "End discount date must be valid and after start discount date"
        }
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: [true, "Store ID is required"],
        validate: {
            validator: function (v) {
                return !v || mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid store ID"
        }
    },
    hasCustomizes: { type: Boolean, default: false },
    customizes: {
        hasColors: { type: Boolean, default: false },
        colors: {
            type: [String],
            default: [],
            required: function () { return this.customizes?.hasColors; },
            validate: {
                validator: arr => Array.isArray(arr) && arr.every(c => typeof c === "string" && c.trim() !== ""),
                message: "Colors must be valid non-empty strings"
            }
        },
        hasSizes: { type: Boolean, default: false },
        sizes: {
            s: { type: Boolean, default: false },
            m: { type: Boolean, default: false },
            l: { type: Boolean, default: false },
            xl: { type: Boolean, default: false },
            xxl: { type: Boolean, default: false },
            xxxl: { type: Boolean, default: false },
            "4xl": { type: Boolean, default: false }
        },
        allowCustomText: { type: Boolean, default: false },
        allowAdditionalNotes: { type: Boolean, default: false },
        allowUploadImages: { type: Boolean, default: false },
        hasAdditionalCost: { type: Boolean, default: false },
        additionalCost: { type: Number, default: 0, min: [0, "Additional cost cannot be negative"] },
        hasAdditionalTime: { type: Boolean, default: false },
        additionalTime: { type: Number, default: 0, min: [0, "Additional time cannot be negative"] },
        hasWeight: { type: Boolean, default: false },
        weightDetails: {
            unit: {
                type: String,
                default: "",
                enum: {
                    values: ["gr", "kg", ""],
                    message: "Weight unit must be one of: gr, kg, or empty"
                }
            },
            weight: {
                type: Number,
                default: null,
                min: [0, "Weight cannot be negative"]
            }
        },
        hasDimentions: { type: Boolean, default: false },
        dimentionsDetails: {
            unit: {
                type: String,
                default: "",
                enum: {
                    values: ["cm", "m", "cm2", "m2", ""],
                    message: "Dimensions unit must be one of: cm, m, cm2, m2, or empty"
                }
            },
            length: {
                type: Number,
                default: null,
                min: [0, "Length cannot be negative"]
            },
            width: {
                type: Number,
                default: null,
                min: [0, "Width cannot be negative"]
            },
            height: {
                type: Number,
                default: null,
                min: [0, "Height cannot be negative"]
            }
        },
        hasProductionDate: { type: Boolean, default: false },
        productionDate: { type: Date, default: null, validate: v => !v || !isNaN(new Date(v).getTime()) },
        hasExpiryDate: { type: Boolean, default: false },
        expiryDate: {
            type: Date,
            default: null,
            validate: function (v) {
                if (!v) return true;
                return !isNaN(new Date(v).getTime()) &&
                    (!this.customizes?.productionDate || v >= this.customizes.productionDate);
            },
            message: "Expiry date must be valid and after production date"
        },
        possibilityOfSwitching: { type: Boolean, default: false },
        possibilityOfReturn: { type: Boolean, default: false },
        hasAdditionalDetails: { type: Boolean, default: false },
        additionalDetails: {
            type: [String],
            default: [],
            validate: {
                validator: arr => Array.isArray(arr) && arr.every(s => typeof s === "string"),
                message: "Additional details must be strings"
            }
        }
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: "brand",
        default: null,
        validate: {
            validator: function (v) { return !v || mongoose.Types.ObjectId.isValid(v); },
            message: "Invalid brand ID"
        }
    },
    gender: {
        type: String,
        enum: {
            values: GENDER_FOR_DASHBOARD,
            message: "Invalid gender"
        },
        default: "all"
    }
}, { timestamps: true });

productSchema.index({ name: 1 });

productSchema.index({ price: 1 });

productSchema.index({ categories: 1 });

productSchema.index({ numberOfOrders: -1 });

productSchema.index({ isAvailableForDelivery: 1 });

productSchema.index({ storeId: 1 });

productSchema.index({ postOfDate: -1 });

productSchema.index({ brand: 1 });

productSchema.index({ gender: 1 });

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;