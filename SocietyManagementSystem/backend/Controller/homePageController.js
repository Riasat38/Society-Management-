`use strict`

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

