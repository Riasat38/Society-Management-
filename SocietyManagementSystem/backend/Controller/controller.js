`use strict`
//this file handles log in and signup related funtions
import User from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })
}

export const getUser = async(req, res) => {
    
    const { username,email,password } = await req.body || {}; 
    //console.log(email,flatno,"route"); //test passed
    try {
        if (!username || !email || !password ) {
            return res.status(400).json({ message: 'Invalid data' });
        }
        const user =  await User.findOne({username:username, email:email});
        console.log(user);
        if (!user ){
          return res.status(401).json({message: 'Invalid credentials',
              redirectUrl: '/society/login'});
      }else{
        const id = user._id.toString();
        if (user && await(bcrypt.compare(password, user.password))) {
          
        return res.status(200).json({ message: 'Logged In',
          user,
          token: generateToken(user._id),
          redirectUrl: `/society/homepage` });
        }
        
      }
    } catch(error){
        console.error("Error in /loginPage:", error.message);
        res.status(400).json({ error: error.message,
            redirectUrl: '/society/login' });
    }   
};
    


export const registerUser = async (req,res) => {
  try{
    const {name,username,email,password,flatno,usertype,contactno,role} = req.body || {};
    console.log(username,email,flatno,usertype,contactno,role); //test passed

    if (!email || !username || !password || !name || !usertype || !contactno) {
        throw new Error(`fields missing from url missing`); 
    };

    if (usertype === "maintenance" && !role) {
        return res.status(400).json({ error: "Role is required for maintenance users" });
    } else if (usertype === "resident" && !flatno) {
        return res.status(400).json({ error: "FlatNo is required for resident users" });
     }
    const existingUser = await User.findOne({ $or: [{email:email}, 
      {username:username}] });
    if (existingUser) {
        res.status(400)
        throw new Error(`${username} with${email} already exists`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        name,
        username,
        email,
        password:hashedPassword,
        flatno,
        usertype,
        contactno,
        role: usertype === "maintenance" ? role : undefined, 
        admin: (await User.countDocuments()) === 0,
      };
    const user = await User.create(userData);
    const id = verifiedUser._id.toString();
    if (user) {
      res.status(201).json({
        user,
        token: generateToken(user._id),
        redirectUrl:`/society/homepage/${(id)}`
      })
    }
  }catch(error) {
    console.error("Error in /registerPage:", error.message);
    res.status(400).json({ error: error.message,
        redirectUrl: '/society/register' });
};
  
};