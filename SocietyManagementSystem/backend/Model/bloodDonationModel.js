'use strict';

import mongoose from 'mongoose';
import moment from 'moment';
const bloodDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true    
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  lastBloodGiven: {
    type: Date,
    required:true,
  },
  available:{
    type: Boolean,
  }
}, {timestamps: true});
function updateAvailability(doc) { 
  const currentDate = new Date(); 
  const lastDonationDate = new Date(doc.lastBloodGiven);  
  const differenceInDays = Math.floor( (currentDate - lastDonationDate) / (1000 * 60 * 60 * 24) ); 
  doc.available = differenceInDays >= 90; 
};

bloodDonationSchema.pre('save', function(next) { 
  updateAvailability(this); 
  next();
});

bloodDonationSchema.pre('find', function(next) { 
  this.find().then(docs => { 
    docs.forEach(doc => updateAvailability(doc)); 
    next(); }).catch(next); 
});


bloodDonationSchema.pre('findOne', function(next) { 
  this.findOne().then(doc => { 
    if (doc) updateAvailability(doc); next(); 
  }).catch(next); 
}); 
 
bloodDonationSchema.pre('findById', function(next) { 
  this.findById().then(doc => { 
    if (doc) updateAvailability(doc); 
    next(); 
  }).catch(next);
});

export default mongoose.model('BloodDonation', bloodDonationSchema);
