'use strict';

import mongoose from 'mongoose';

const bloodDonationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true,
  },
  donorContact: {
    type: String,
    required: true,
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  donationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastBloodGiven: {
    type: Date,
    required:true,
  },
});


const donor= mongoose.model('BloodDonation', bloodDonationSchema)
export default donor