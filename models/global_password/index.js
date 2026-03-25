const mongoose = require("../../database");

// Create Global Password Schema

const globalPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [128, "Password cannot exceed 128 characters"],
        validate: {
            validator: function (v) {
                if (/^\$2[aby]\$/.test(v)) return true;
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
            },
            message: function (props) {
                const val = props.value || "";
                const errors = [];
                if (val.length < 8) errors.push("at least 8 characters");
                if (!/[A-Z]/.test(val)) errors.push("one uppercase letter");
                if (!/[a-z]/.test(val)) errors.push("one lowercase letter");
                if (!/\d/.test(val)) errors.push("one number");
                return "Password must contain " + errors.join(", ");
            }
        }
    }
}, { timestamps: true });

globalPasswordSchema.index({ email: 1 }, { unique: true });

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

module.exports = globalPasswordModel;