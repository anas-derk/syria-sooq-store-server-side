const mongoose = require("../../database");

// Create Notification Schema

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, "UserId is required"],
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: "Invalid User Id"
        }
    },
    title: {
        type: String,
        required: [true, "Notification title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Title cannot be empty"
        }
    },
    body: {
        type: String,
        required: [true, "Notification body is required"],
        trim: true,
        maxlength: [1000, "Body cannot exceed 1000 characters"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Body cannot be empty"
        }
    },
    data: {
        type: Map,
        required: [true, "Notification data is required"],
        validate: {
            validator: function (v) {
                return v instanceof Map && v.size > 0;
            },
            message: "Data must be a non-empty map"
        }
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

notificationSchema.index({ userId: 1 });

notificationSchema.index({ isRead: 1 });

notificationSchema.index({ createdAt: -1 });

notificationSchema.index({ userId: 1, isRead: 1 });

// Create Notification Model From Notification Schema

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;