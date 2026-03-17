const mongoose = require("../../database");

// Create Brand Schema

const brandSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: [true, "Image path is required"],
        trim: true
    },
    title: {
        type: String,
        required: [true, "Brand title is required"],
        trim: true,
        minlength: [2, "Brand title must be at least 2 characters"],
        maxlength: [100, "Brand title cannot exceed 100 characters"]
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
    }
}, { timestamps: true });

brandSchema.index({ storeId: 1 });

brandSchema.index({ title: 1 });

brandSchema.index({ createdAt: -1 });

// Create Brand Model From Brand Schema

const brandModel = mongoose.model("brand", brandSchema);

module.exports = brandModel;