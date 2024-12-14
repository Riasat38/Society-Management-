import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    flatno: {
        type: String,
        required: function () { 
            return this.usertype === "resident";
        },
        default: null
    },
    usertype: {
        type: String,
        required: true,
        enum: ["resident", "maintenance"]
    },
    role: {
        type: String,
        required: function () { 
            return this.usertype === "maintenance";
        },
        default: null
    },
    joiningDate: {
        type: Date,
        default: function () { 
            return this.usertype === 'maintenance' ? new Date() : null;
        }
    },
    contactno: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false // Default is non-admin
    }
});

// Ensure `joiningDate` is set before validation
userSchema.pre('validate', function (next) { 
    if (this.usertype === 'maintenance' && !this.joiningDate) { 
        this.joiningDate = new Date(); 
    }
    next();
});

export default mongoose.model("User", userSchema);
