const mongoose = require("../../database");

// Create Notification Schema

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    data: {
        type: Map,
        of: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});

// Create Notification Model From Notification Schema

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;