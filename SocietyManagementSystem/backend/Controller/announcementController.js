import Announcement from "../Model/announcementModel.js";
import User from "../Model/userModel.js";
// Fetch all announcements
export const getAllAnnouncements = async () => {
    return await Announcement.find()
        .populate("adminId", "name email") // Populate admin details (name, email, etc.)
        .sort({ createdAt: -1 }); // Sort announcements by most recent
};

// Create a new announcement
export const createAnnouncement = async (req, res) => {
    try {
      const { content } = req.body;
      const adminId = req.user.id;
      const adminUser = await User.findById(adminId);
      if (!adminUser || !adminUser.admin) {
        return res.status(403).json({ error: "Only admins can create announcements." });
      }
  
      if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Content cannot be empty." });
      }
  
      // Create and save the announcement
      const announcement = await Announcement.create({
        content,
        adminId,
      });
  
      return res.status(201).json({
        message: "Announcement created successfully.",
        data: announcement,
      });
    } catch (error) {
      console.error("Error creating announcement:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  };

// Delete an announcement by ID
export const deleteAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.user.id; // Assuming `req.user` contains the authenticated user
      const adminUser = await User.findById(adminId);
      if (!adminUser || !adminUser.admin) {
        return res.status(403).json({ error: "Only admins can delete announcements." });
      }  
      // Find and delete the announcement
      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found." });
      }
  
      await announcement.remove();
      return res.status(200).json({ message: "Announcement deleted successfully." });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  };
  
