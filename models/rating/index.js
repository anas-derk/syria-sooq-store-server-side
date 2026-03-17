const mongoose = require("../../database");

const ratingConstants = require("../../constants/ratings");

// Create Rating Schema

const ratingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    },
    type: {
        type: String,
        required: [true, "Rating type is required"],
        enum: {
            values: ratingConstants.RATING_TYPE,
            message: "Invalid rating type"
        },
        trim: true
    },
    id: {
        type: String,
        required: [
            function () { return this.type !== "app"; },
            "ID is required unless rating type is 'app'"
        ],
        trim: true,
        validate: {
            validator: function (v) {
                if (this.type === "app") return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid ID"
        }
    },
    rating: {
        type: Number,
        required: [true, "Rating value is required"],
        enum: {
            values: ratingConstants.RATING,
            message: "Invalid rating value"
        }
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, "Notes cannot exceed 1000 characters"]
    }
}, { timestamps: true });

ratingSchema.index({ userId: 1 });

ratingSchema.index({ type: 1 });

ratingSchema.index({ id: 1 });

ratingSchema.index({ userId: 1, id: 1, type: 1 }, { unique: true });

// Create Rating Model From Rating Schema

const ratingModel = mongoose.model("rating", ratingSchema);

module.exports = ratingModel;