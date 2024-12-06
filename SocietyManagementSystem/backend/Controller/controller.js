`use strict`
//this file handles log in and signup related funtions
import User from "../Model/userModel.js";

export const getUser = (email) => {
    const user = User.findOne({email: email})
    .then(user => {
        console.log(user); // Will log the found document or `null` if not found
      })
      .catch(err => {
        console.error('Error:', err);
      });
    //console.log(email,"getuser"); //test passed
    return user; //thisreturning undefined 
};

export const createUser = async (username, email, flatno, usertype, contactno, role) => {
    try {
      if (!username || !email || !flatno || !usertype || !contactno) {
        throw new Error("Some required fields are missing");
      }
      if (User.findOne({email: email})){
        throw new Error(`${email} already exists`);
      }
      if (usertype === "maintenance" && !role) {
        throw new Error("Role is required for maintenance users");
      } else if (usertype === "resident" && role) {
        throw new Error("Role should not be provided for resident users");
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
  