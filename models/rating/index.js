const mongoose = require("../../database");

// Create Rating Schema

const ratingShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["product", "store"]
    },
    id: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    }
});

// Create Rating Model From Rating Schema

const ratingModel = mongoose.model("rating", ratingShema);

module.exports = ratingModel;