`use strict`

import User from "../Model/userModel.js";

export const getStaff = (req,res) => {
    try{
        const staffs = User.find({ usertype: 'maintenance'});
        return staffs
    } catch(error){
        console.log(error)
        return error
    }
};