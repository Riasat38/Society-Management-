`use strict`;
//this file handles log in and signup related routes 
import express from "express";
import {getUser,createUser} from "../Controller/controller.js";
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


//give us the login page
router.get("/login", (req,res) => {
    res.send("required a log in form")
});

//log in form filled out
router.post("/login", async(req, res) => {
     
    const { email,flatno } = await req.body || {}; 
    //console.log(email,flatno,"route"); //test passed
    try {
        if (!email || !flatno) {
            return res.status(400).json({ msg: 'Bad request: no email or flatNo found' });
        } 
        const user = await getUser(email);
        if (user === null){
            return res.status(401).redirect('/society');
        }
        const id = user._id.toString();
        res.status(201).redirect(`/society/homepage/:${id}`);

    } catch(error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

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

        res.redirect(`/society/registerPage?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
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
    res.json({username : name, email: email});

});

//Processing register formm and creating an user
router.post("/registerPage", (req,res) => {
    
    const {username,email,flatno,usertype,contactno,role} = req.body || {};
    //console.log(username,email,flatno,usertype,contactno,role); //test passed

    if (!email || !username) {
        throw new Error(`fields missing from url missing`); 
    };

    if (usertype === "maintenance" && !role) {
        return res.status(400).json({ error: "Role is required for maintenance users" });
    } else if (usertype === "resident" && !flatno) {
        return res.status(400).json({ error: "FlatNo is required for resident users" });
     }
    
    const verifiedUser = createUser(username,email,flatno,usertype,contactno,role)
    .then((verifiedUser) => {
        console.log("Verified User:", verifiedUser._id.toString()); // Log the created user data // json data user returned from db //test Passed
        const id = verifiedUser._id.toString();
        // Redirect to the homepage after successful registration
        res.status(201).redirect(`/society/homepage/${(id)}`);
    })
    .catch((error) => {
        console.error("Error in /registerPage:", error.message);
        res.status(500).json({ error: error.message });
    });
  
});


export default router; 