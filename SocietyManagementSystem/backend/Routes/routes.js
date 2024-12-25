`use strict`;
//this file handles log in and signup related routes 
import express from "express";
import {loginUser,registerUser,getRecruitment, logoutUser} from "../Controller/controller.js";
import { getALLrents } from "../Controller/homePageController.js";
import User from "../Model/userModel.js";

const router = express.Router();

//initial Welcome page
router.get("/" , getRecruitment, getALLrents);

router.get("/about", (req,res) =>{
    res.json("This Is About Page");
});



router.post("/login",loginUser);
     
router.post("/logout", logoutUser);

//Processing register formm and creating an user
router.post("/registerPage", registerUser); 

export default router; 