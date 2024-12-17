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
});

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
