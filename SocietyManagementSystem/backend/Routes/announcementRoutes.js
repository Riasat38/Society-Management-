import express from "express";
import { body, validationResult } from "express-validator";
import ensureAdmin from "../Middleware/admincheck.js";
import {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
} from "../Controller/announcementController.js";

const router = express.Router();

// Middleware to ensure the user is an admin
router.use(ensureAdmin);

//Fetch all announcements
router.get("/:id/adminPanel/announcements", async (req, res) => {
    try {
        const announcements = await getAllAnnouncements();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch announcements",
            details: error.message,
        });
    }
});

// POST: Create a new announcement
router.post(
    "/:id/adminPanel/announcements",
    body("content").notEmpty().withMessage("Content is required"), // Validate 'content' field
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content } = req.body;
        const adminId = req.user._id; // Assuming req.user contains authenticated admin details

        try {
            const announcement = await createAnnouncement({ content, adminId });
            res.status(201).json({
                message: "Announcement created successfully",
                announcement,
            });
        } catch (error) {
            res.status(500).json({
                error: "Failed to create announcement",
                details: error.message,
            });
        }
    }
);

// DELETE: Delete an announcement by ID
router.delete("/:id/adminPanel/announcements/:announcementId", async (req, res) => {
    const { announcementId } = req.params;

    try {
        const result = await deleteAnnouncement(announcementId);
        if (result) {
            res.status(200).json({ message: "Announcement deleted successfully" });
        } else {
            res.status(404).json({ error: "Announcement not found" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete announcement",
            details: error.message,
        });
    }
});

export default router;
