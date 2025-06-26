const mongoose = require("../../database");

// Create Ad Schema

const adSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: () => this.type === "elite",
    },
    city: {
        type: String,
        required: () => this.type === "panner",
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
        ],
    },
    imagePath: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "panner",
        enum: ["panner", "elite"],
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true,
    },
    dateOfPost: {
        type: Date,
        default: Date.now,
    },
});

// Create Ad Model From Ad Schema

const adModel = mongoose.model("ad", adSchema);

module.exports = adModel;