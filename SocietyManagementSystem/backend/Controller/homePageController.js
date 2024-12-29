`use strict`

import donor from "../Model/bloodDonationModel.js";
import User from "../Model/userModel.js";
import Help from './path/to/helpPost.js'

export const getStaff = (req,res) => {
    try{
        const staffs = User.find({ usertype: 'maintenance'});
        return staffs
    } catch(error){
        console.log(error)
        return error
    }
};

export const createHelpPost = async (description, userId) => {
     try {  
         const user = await User.findById(userId); 
         if (!user) { 
            throw new Error("User not found"); 
        }  
        const helpPost = await Help.create({ description, user: userId });
        console.log('Help Post Created:', helpPost); 
        return helpPost; 
    } catch (error) { 
        console.error('Error creating help post:', error);
        return null; 
        } 
};

export const getPosts = async(req,res) => {
    const posts = await Help.find({resolve_status : false })
    return posts;  
    
};


//bloodDonation

export const addBloodDonation = async (req, res) => {
    try {
        const { donorName, donorContact, bloodGroup, donationDate, lastBloodGiven} = req.body;

        // Validation
        if (!donorName || !donorContact || !bloodGroup || !lastBloodGiven) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const lastDonationDate = new Date(lastBloodGiven);
        if (isNaN(lastDonationDate)) {
          return res.status(400).json({ error: "Invalid date format for lastBloodGiven" });
        }
        const currentDate = new Date();
        const differenceInDays = Math.floor(
            (currentDate - lastDonationDate) / (1000 * 60 * 60 * 24)
        );

        if (differenceInDays < 120) {
            return res.status(400).json({
                error: `Donor is not eligible to donate blood. Please wait ${120 - differenceInDays} more days.`,
            });
        }

        const donorInfo= await donor.create({
            donorName,
            donorContact,
            bloodGroup,
            donationDate:donationDate||Date.now(),
            lastBloodGiven

        });

        console.log('Blood Donation Record Created:', donorInfo);
        res.status(201).json({ message: "Blood donation record added successfully",donorInfo });
    } catch (error) {
        console.error('Error adding blood donation record:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllBloodDonations = async (req, res) => {
    try {
        const donations = await donor.find();
        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching blood donation records:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//lost and found
export class LostAndFound {
  static count = 0; 
  constructor(userId, itemName, description, status, contact) {
      this.id = LostAndFound.count++;
      this.userId = userId;
      this.itemName = itemName;
      this.description = description;
      this.status = status;
      this.contact = contact;
  }
}

let lostAndFoundItems = [];

export const createLostAndFound = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const { itemName, description, status } = req.body;

  try {
      if (!itemName || !description || !status) {
          return res.status(400).json({ error: "Please provide all required details." });
      }
      const newItem = new LostAndFound(
          userId,
          itemName,
          description,
          status,
          user.contactno//ei branch e user schema consider kore 
      );
      lostAndFoundItems.push(newItem); 
      return res.status(200).json({
          message: "Lost and found item posted successfully.",
          data: newItem,
      });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

export const getAllLostAndFound = (req, res) => {
  try {
      return res.status(200).json({
          message: "Lost and found items retrieved successfully.",
          data: lostAndFoundItems,
      });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

// Controller to update the status of a lost or found item
export const updateLostAndFoundStatus = (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;

  try {
      const item = lostAndFoundItems.find((item) => item.id == itemId);//call back function er through te iteration

      if (!item) {
          return res.status(404).json({ error: "Item not found." });
      }

      item.status = status || item.status; // Update the status if provided
      return res.status(200).json({
          message: "Item status updated successfully.",
          data: item,
      });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

export const deleteLostAndFound = (req, res) => {
  const { itemId } = req.params;

  try {
      const index = lostAndFoundItems.findIndex((item) => item.id == itemId);

      if (index === -1) {
          return res.status(404).json({ error: "Item not found." });
      }

      const deletedItem = lostAndFoundItems.splice(index, 1); // Replace korsi kichu add na kore basically delete
      return res.status(200).json({
          message: "Item deleted successfully.",
          data: deletedItem,
      });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};