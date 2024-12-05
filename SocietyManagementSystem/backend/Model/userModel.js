import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    flatno: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    contactNo : {
        type: Number,
        required:true
    }
});

export default mongoose.model("User", userSchema);