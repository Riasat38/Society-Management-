`use strict`;

import express from "express";
const router = express.Router();


router.get("/" ,(req,res) => {
    res.json("Welcome")
});

router.get("/about", (req,res) =>{
    res.json("This Is About Page");
});

export default router;