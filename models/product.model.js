const mongoose = require("../database");

// Create Product Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "categorie",
        }],
    },
    discount: {
        type: Number,
        default: 0,
    },
    discountInOfferPeriod: {
        type: Number,
        default: 0,
    },
    offerDescription: String,
    numberOfOrders: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    isAvailableForDelivery: {
        type: Boolean,
        default: false,
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
    },
    imagePath: {
        type: String,
        required: true,
    },
    galleryImagesPaths: [String],
    colorImagesPaths: [String],
    startDiscountPeriod: Date,
    endDiscountPeriod: Date,
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: true,
    },
    hasCustomizes: {
        type: Boolean,
        default: false,
    },
    customizes: {
        hasColors: {
            type: Boolean,
            default: false,
        },
        colors: {
            type: [String],
            default: [],
            required: () => this.hasColors,
        },
        hasSizes: {
            type: Boolean,
            default: false,
        },
        sizes: {
            s: {
                type: Boolean,
                default: false,
            },
            m: {
                type: Boolean,
                default: false,
            },
            l: {
                type: Boolean,
                default: false,
            },
            xl: {
                type: Boolean,
                default: false,
            },
            xxl: {
                type: Boolean,
                default: false,
            },
            xxxl: {
                type: Boolean,
                default: false,
            },
            "4xl": {
                type: Boolean,
                default: false,
            }
        },
        allowCustomText: {
            type: Boolean,
            default: false,
        },
        allowAdditionalNotes: {
            type: Boolean,
            default: false,
        },
        allowUploadImages: {
            type: Boolean,
            default: false,
        },
        hasAdditionalCost: {
            type: Boolean,
            default: false,
        },
        additionalCost: {
            type: Number,
            default: 0,
        },
        hasAdditionalTime: {
            type: Boolean,
            default: false,
        },
        additionalTime: {
            type: Number,
            default: 0,
        },
        hasWeight: {
            type: Boolean,
            default: false,
        },
        weightDetails: {
            unit: {
                type: String,
                default: "",
                enum: ["gr", "kg", ""]
            },
            weight: {
                type: Number,
                default: null
            }
        },
        hasDimentions: {
            type: Boolean,
            default: false,
        },
        dimentionsDetails: {
            unit: {
                type: String,
                default: "",
                enum: ["cm", "m", "cm2", "m2", ""]
            },
            length: {
                type: Number,
                default: null
            },
            width: {
                type: Number,
                default: null
            },
            height: {
                type: Number,
                default: null
            },
        },
        hasProductionDate: {
            type: Boolean,
            default: false,
        },
        productionDate: {
            type: Date,
            default: null,
        },
        hasExpiryDate: {
            type: Boolean,
            default: false,
        },
        expiryDate: {
            type: Date,
            default: null,
        },
        possibilityOfSwitching: {
            type: Boolean,
            default: false,
        },
        possibilityOfReturn: {
            type: Boolean,
            default: false,
        },
        hasAdditionalDetails: {
            type: Boolean,
            default: false,
        },
        additionalDetails: {
            type: [String],
            default: false,
        },
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: "brand",
        default: null,
    },
});

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;