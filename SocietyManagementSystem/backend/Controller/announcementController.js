import Announcement from "../Model/announcementModel.js";

// Fetch all announcements
export const getAllAnnouncements = async () => {
    return await Announcement.find()
        .populate("adminId", "name postedAt") // Populate admin details (name, email, etc.)
        .sort({ createdAt: -1 });       // Sort announcements by most recent
};

// Create a new announcement
export const createAnnouncement = async ({ content, adminId }) => {
    const newAnnouncement = new Announcement({
        content,
        adminId
    });
    return await newAnnouncement.save();
};

// Delete an announcement by ID
export const deleteAnnouncement = async (announcementId) => {
    const result = await Announcement.findByIdAndDelete(announcementId);
    return result ;
};
