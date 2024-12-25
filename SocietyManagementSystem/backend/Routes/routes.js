`use strict`;
//this file handles log in and signup related routes 
import express from "express";
import {getUser,registerUser} from "../Controller/controller.js";

import User from "../Model/userModel.js";

const router = express.Router();

//initial Welcome page
router.get("/" ,(req,res) => {
    res.json("WELCOME")
});

router.get("/about", (req,res) =>{
    res.json("This Is About Page");
});


//log in form filled out
router.post("/login",getUser) 
     
//router.post("/logout")

//Processing register formm and creating an user
router.post("/registerPage", registerUser) 

export default router; 