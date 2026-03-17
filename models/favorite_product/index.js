const mongoose = require("../../database");

// Create Favorite Product Schema

const favoriteProductSchema = new mongoose.Schema({
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
    imagePath: {
        type: String,
        required: [true, "Image path is required"],
        trim: true
    },
    productId: {
        type: String,
        required: [true, "Product ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid product ID"
        }
    },
    userId: {
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    }
}, { timestamps: true });

favoriteProductSchema.index({ name: 1 });

favoriteProductSchema.index({ productId: 1 });

favoriteProductSchema.index({ userId: 1 });

favoriteProductSchema.index(
    { userId: 1, productId: 1 },
    { unique: true }
);

// Create Favorite Product Model From Favorite Product Schema

const favoriteProductModel = mongoose.model("favorite_products", favoriteProductSchema);

module.exports = favoriteProductModel;