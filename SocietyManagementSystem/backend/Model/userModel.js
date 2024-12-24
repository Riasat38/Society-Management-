import { name } from "ejs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    username: {
        type: String,
        required: true, 
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
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
        enum: ["resident", "maintenance","other"]
    },
    role: {
        type: String,
        required: function () { 
            return this.usertype === "maintenance";
        },
        default: null,
        enum: ["Gatekeeper", "Plumber", "Electrician", "Caretaker", "Other"]

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

// Pre-validate hook to set joining date for maintenance staff
userSchema.pre('validate', function (next) { 
    if (this.usertype === 'maintenance' && !this.joiningDate) { 
        this.joiningDate = new Date(); 
    }
    next();
});

export default mongoose.model("User", userSchema);
