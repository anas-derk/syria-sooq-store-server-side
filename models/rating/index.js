const mongoose = require("../../database");

const ratingConstants = require("../../constants/ratings");

// Create Rating Schema

const ratingShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ratingConstants.RATING_TYPE
    },
    id: {
        type: String,
        required: () => this.type !== "app",
    },
    rating: {
        type: Number,
        required: true,
        enum: ratingConstants.RATING
    },
    notes: String,
});

// Create Rating Model From Rating Schema

const ratingModel = mongoose.model("rating", ratingShema);

module.exports = ratingModel;