`use strict`;
//this file handles log in and signup related routes 
import express from "express";
import {getUser,registerUser} from "../Controller/controller.js";
import passport from "passport";
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
     
    


router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).json({ msg: "Logout failed. Try again." });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session Destroy Error:", err);
                return res.status(500).json({ msg: "Session could not be destroyed." });
            }
            res.clearCookie("connect.sid"); 
            res.redirect("/society"); 
        });
    });
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
        
        const { name,email } = req.user; // Access the email and display name from the user object

        res.json({ 
            message: `authentication successful`,
            redirectUrl:`/society/registerPage?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`});
    }
);
  
//protected
router.get('/registerPage', (req, res) => {
    
    const name = decodeURIComponent(req.query.name) || {}; 
    const email = decodeURIComponent(req.query.email) || {};
    if (!email || !name) {
        throw new Error(`name and email missijg from url missing`); 
    };
    console.log(name,email,"protected");

    const queryData = JSON.stringify({ message: 'Welcome to the registerPage!',name, email });
    res.json({name : name, email: email});

});

//Processing register formm and creating an user
router.post("/registerPage", registerUser) 

export default router; 