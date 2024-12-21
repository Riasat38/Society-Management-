import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now, 
    },
}, {timestamps: true});
export default mongoose.model("Announcement", announcementSchema);

