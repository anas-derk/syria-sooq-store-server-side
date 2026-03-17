const mongoose = require("../../database");

// Create Ad Schema

const adSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: [true, "Store ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
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
            values: [
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
            ],
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
        default: "panner",
        enum: {
            values: ["panner", "elite"],
            message: "Invalid ad type"
        },
        trim: true
    },
    product: {
        type: String,
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