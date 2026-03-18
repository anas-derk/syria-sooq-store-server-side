const mongoose = require("../../database");

const { CITIES } = require("../../constants/cites");

const { ADVERTISMENT_TYPE, DEFAULT_ADVERTISMENT_TYPE } = require("../../constants/ads");

// Create Ad Schema

const adSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: [
            function () {
                return this.type === "elite";
            },
            "Content is required for elite ads"
        ],
        trim: true
    },
    city: {
        type: String,
        required: [
            function () {
                return this.type === "panner";
            },
            "City is required for panner ads"
        ],
        enum: {
            values: CITIES,
            message: "Invalid city"
        },
        trim: true
    },
    imagePath: {
        type: String,
        required: [true, "Image path is required"],
        trim: true
    },
    type: {
        type: String,
        default: DEFAULT_ADVERTISMENT_TYPE,
        enum: {
            values: ADVERTISMENT_TYPE,
            message: "Invalid ad type"
        },
        trim: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: [true, "Product reference is required"],
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid product ID"
        }
    },
    dateOfPost: {
        type: Date,
        default: Date.now,
        validate: {
            validator: v => !v || !isNaN(new Date(v).getTime()),
            message: "Invalid dateOfPost"
        }
    }
}, { timestamps: true });

adSchema.index({ storeId: 1 });

adSchema.index({ city: 1 });

adSchema.index({ type: 1 });

adSchema.index({ product: 1 });

adSchema.index({ dateOfPost: 1 });

// Create Ad Model From Ad Schema

const adModel = mongoose.model("ad", adSchema);

module.exports = adModel;