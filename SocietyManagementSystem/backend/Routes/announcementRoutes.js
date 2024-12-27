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

// GET: Fetch all announcements
router.get("/:id/announcements", async (req, res) => {
    try {
        const announcements = await getAllAnnouncements();
        if (!announcements || announcements.length === 0) {
            return res.status(404).json({ error: "No announcements found." });
        }
        res.status(200).json({
            message: "Announcements fetched successfully.",
            data: announcements,
        });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// POST: Create a new announcement
router.post("/:id/announcements", ensureAdmin, async (req, res) => {
    try {
        await createAnnouncement(req, res);
    } catch (error) {
        console.error("Error in creating announcement route:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});
// DELETE: Delete an announcement by ID
router.delete("/:id/announcements/:announcementId", ensureAdmin, async (req, res) => {
    try {
        req.params.id = req.params.announcementId; // Map the parameter for consistency with controller
        await deleteAnnouncement(req, res);
    } catch (error) {
        console.error("Error in deleting announcement route:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

export default router;
