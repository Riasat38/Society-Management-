`use strict`
import mongoose from "mongoose";

const lostAndFoundSchema = new mongoose.Schema({
  itemName: {
     type: String,
     required: true
    },
  description: {
    type: String,
    required: true 
    },
  dateReported: {
    type: Date,
    default: Date.now
    },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
  status: {
    type: String,
    enum: ["lost", "found", "resolved"],
    default: "lost"
    },
  contactInfo: {
    type: String,
    required: true
    },
});

const LostAndFound = mongoose.model("LostAndFound", lostAndFoundSchema);
export default LostAndFound;
