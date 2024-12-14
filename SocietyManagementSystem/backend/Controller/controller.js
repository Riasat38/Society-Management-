`use strict`
//this file handles log in and signup related funtions
import User from "../Model/userModel.js";

export const getUser = (email) => {
    const user =  User.findOne({email: email})
    //console.log(email,"getuser"); //test passed
      return user   //return null if user not found
};

export const createUser = async (username, email, flatno, usertype, contactno, role) => {
    try {
      if (!username || !email  || !usertype || !contactno) {
        throw new Error("Some required fields are missing");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          throw new Error(`${email} already exists`);
      }
      if (usertype === "maintenance" && !role) {
        throw new Error("Role is required for maintenance users");
      } else if (usertype === "resident" && !flatno) {
        throw new Error("FlatNO is required for for resident users");
      }
  
      const userData = {
        username,
        email,
        flatno,
        usertype,
        contactno,
      };
  
      if (usertype === "maintenance") {
        userData.role = role;
      }
      const userCount = await User.countDocuments();
      if (userCount === 0 ){
        userData.admin = true;
      }
  
      // Create user document in the database
      const user = await User.create(userData);
      console.log("User created:", user);
      return user;
    } 
    catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  };
  