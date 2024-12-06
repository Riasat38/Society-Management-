import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    flatno: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true,
        enum: ["resident", "maintenance"]
    },
    role : {
        type: String, // Only required for maintenance
        required: function () {
        return this.userType === "maintenance";}
    },
    contactno : {
        type: String,
        required:true
    }
});

export default mongoose.model("User", userSchema);