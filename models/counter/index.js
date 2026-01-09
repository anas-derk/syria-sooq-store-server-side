const mongoose = require("../../database");

const { COUNTER_NAMES, DEFAULT_COUNTER_NAME } = require("../../constants/counters");

// Create Counter Schema

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        default: DEFAULT_COUNTER_NAME,
        enum: COUNTER_NAMES,
    },
    seq: {
        type: Number,
    }
});

// Create Counter Model From Counter Schema

const counterModel = mongoose.model("counter", counterSchema);

module.exports = counterModel;