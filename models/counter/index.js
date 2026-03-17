const mongoose = require("../../database");

const { COUNTER_NAMES, DEFAULT_COUNTER_NAME } = require("../../constants/counters");

// Create Counter Schema

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Counter name is required"],
        default: DEFAULT_COUNTER_NAME,
        enum: {
            values: COUNTER_NAMES,
            message: "Invalid counter name"
        },
        trim: true
    },
    seq: {
        type: Number,
        required: [true, "Sequence number is required"],
        default: 0,
        min: [0, "Sequence number cannot be negative"]
    }
}, { timestamps: true });

counterSchema.index({ name: 1 }, { unique: true });

counterSchema.index({ createdAt: -1 });

// Create Counter Model From Counter Schema

const counterModel = mongoose.model("counter", counterSchema);

module.exports = counterModel;