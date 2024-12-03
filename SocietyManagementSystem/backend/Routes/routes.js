`use strict`;

import express from "express";
const router = express.Router();


router.get("/" ,(req,res) => {
    res.json("Welcome")
});

router.get("/about", (req,res) =>{
    res.json("This Is About Page");
});

router.get("/login", (req,res) => {
    res.json("Log IN Page");
});

router.post("/login", (req,res) => {
    if (!req.body.name){
        return res.status(400).json({msg:`bad request.no name found`});
    }
    console.log(req.body.name);
    return res.status(200).json({msg: `logged in`});
    
});

export default router; 