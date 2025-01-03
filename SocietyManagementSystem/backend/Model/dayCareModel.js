'use strict';

import mongoose from "mongoose";

const daycareSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Reference to the user (resident) enrolling in daycare
    },
    childName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    dropTime: {
        type: String,
        required: true // Example: "9:00 AM"
    },
    pickTime: {
        type: String,
        required: true // Example: "5:00 PM"
    },
    schedule: {
        type: String,
        required: true // Example: "Monday-Friday"
    },
    additionalNotes: {
        type: String,
        trim: true // Any special instructions or notes
    }
}, { timestamps: true });

const Daycare = mongoose.model("Daycare", daycareSchema);
export default Daycare;
