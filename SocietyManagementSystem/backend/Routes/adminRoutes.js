`use strict`
import express from "express";
import { body, validationResult } from "express-validator";

import {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
} from "../Controller/announcementController.js";

const router = express.Router();
router.get("/:id", (req, res) => {
    res.send("Admin Panel");
});


//Fetch all announcements
router.get("/:id/announcements", async (req, res) => {
    try {
        const announcements = await getAllAnnouncements();
        return res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch announcements" + error.message
        });
    }
});

// POST: Create a new announcement
router.post("/:id/announcements",
    body("content").notEmpty().withMessage("Content is required"), // Validate 'content' field
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content } = req.body;
        const adminId = req.params.id; 

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
router.delete("/:id/announcements/:announcementId", async (req, res) => {
    const { announcementId } = req.params;
    const adminId = req.params.id;
    try {
        const result = await deleteAnnouncement(announcementId);
        if (result) {
            res.status(200).json({ message: "Announcement deleted successfully" , 
                redirectUrl: '/society/homepage/' + adminId + '/announcements'
            });
        } else {
            res.status(404).json({ error: "Announcement not found" ,
                redirectUrl: '/society/homepage/' + adminId + '/announcements'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete announcement",
            details: error.message,
        });
    }
});

export default router;
