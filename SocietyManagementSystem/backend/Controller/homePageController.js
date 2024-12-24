`use strict`

import bloodDonation from "../Model/bloodDonationModel.js";
import bloodDonation from "../Model/bloodDonationModel.js";
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
        const { donorName, donorContact, bloodGroup, donationDate } = req.body;

        // Validation
        if (!donorName || !donorContact || !bloodGroup) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const bloodDonate= await bloodDonation.create({
            donorName,
            donorContact,
            bloodGroup,
            donationDate,
        });

        console.log('Blood Donation Record Created:', bloodDonate);
        res.status(201).json({ message: "Blood donation record added successfully", bloodDonate });
    } catch (error) {
        console.error('Error adding blood donation record:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBloodDonations = async (req, res) => {
    try {
        const donations = await bloodDonation.find();
        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching blood donation records:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
