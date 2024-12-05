`use strict`;

import express from "express";
import {getUser,createUser} from "../Controller/controller.js";
import passport from "passport";

const router = express.Router();

//initial Welcome page
router.get("/" ,(req,res) => {
    res.json("WELCOME")
});

router.get("/about", (req,res) =>{
    res.json("This Is About Page");
});

router.get("/user" ,getUser);
router.post("/user",createUser);

router.get("/login", (req,res) => {
    res.json("Log IN Page");
});

router.post("/login", (req, res) => {
    console.log(req.body); 
    const { name } = req.body || {}; 
    console.log(name);
    try {
        if (!name) {
            return res.status(400).json({ msg: 'Bad request: no name found' });
        }
        return res.status(200).json({ msg: 'Logged in' });
    } catch(error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

//signup page 
router.get("/register", (req, res) => {
    res.send('<a href="http://localhost:4069/society/auth/google">Authenticate with Google</a>');
});

router.get("/auth/google", passport.authenticate('google', { scope: ['email', 'profile'] }));


router.get(
    "/oauth2/redirect/google",
    passport.authenticate('google', { failureRedirect: '/', failureMessage: true }),
    (req, res) => {
        // At this point, the user has been authenticated, and req.user contains the profile data
        
        const { name,email } = req.user; // Access the email and display name from the user object
        
        res.redirect(`/society/homepage?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
    }
);
  
//protected
router.get('/homepage', (req, res) => {
    const { name,email } = req.query; // Access data from query parameters
    console.log(name,email);
    if (!email || !name) {
      throw new Error(`fields missing`); // If no user data is found, redirect to login
    }
  
    // Use the user data (email and displayName) in the response or for other logic
    res.json({
      message: 'Welcome to the homepage!',
      email: email,
      displayName: name,
    });
});
//nopt complete yet
router.post("/homepage", passport.authenticate((req,res) => {
   console.log();
}));

//creating user
//router.post()
export default router; 