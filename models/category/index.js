const mongoose = require("../../database");

// Create Category Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        minlength: [2, "Category name must be at least 2 characters"],
        maxlength: [100, "Category name cannot exceed 100 characters"]
    },
    color: {
        type: String,
        required: [true, "Color is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Color must be a valid hex code, e.g., #FFF or #FFFFFF"
        }
    },
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
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "categorie",
        default: null,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid parent category ID"
        }
    },
    minAge: {
        type: Number,
        required: [
            function () { return !!this.parent; },
            "Minimum age is required for subcategories"
        ],
        min: [0, "Minimum age cannot be negative"],
        max: [120, "Minimum age cannot exceed 120"]
    },
    maxAge: {
        type: Number,
        required: [
            function () { return !!this.parent && this.minAge; },
            "Maximum age is required for subcategories and must be exist minAge"
        ],
        min: [0, "Maximum age cannot be negative"],
        max: [120, "Maximum age cannot exceed 120"],
        validate: {
            validator: function (v) {
                return this.minAge == null || v >= this.minAge;
            },
            message: "Maximum age must be greater than or equal to minimum age"
        }
    },
    imagePath: {
        type: String,
        required: [true, "Image path is required"],
        trim: true
    }
}, { timestamps: true });

// Create Category Model From Category Schema

const categoryModel = mongoose.model("categorie", categorySchema);

categorySchema.index({ storeId: 1 });

categorySchema.index({ name: 1 });

categorySchema.index({ parent: 1 });

categorySchema.index({ minAge: 1 });

categorySchema.index({ maxAge: 1 });

categorySchema.index({ minAge: 1, maxAge: 1 });

categorySchema.index({ createdAt: -1 });

categorySchema.index({ name: 1, storeId: 1, parent: 1 }, { unique: true });

module.exports = categoryModel;