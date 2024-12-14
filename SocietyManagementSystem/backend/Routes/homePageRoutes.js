`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";

import passport from "passport";
import User from "../Model/userModel.js";
const router = express.Router();
import {getStaff} from "../Controller/homePageController.js";
import ensureAdmin from './Middleware/admincheck.js'
import addUserIdToUrl from "../Middleware/urlencoder.js";

router.use(addUserIdToUrl);
//HomePage  router
router.get("/:id", ensureAdmin, (req,res) =>{ 
    const user = req.user;
    if (!user){
        res.status(400).json({error : `Could not find the user`});
    }
    res.status(200).json(user);

});

router.get('/:id/adminPanel', ensureAdmin, (req,res) => {
    res.status(200).json({msg : 'render a page'})
});

router.post('/:id/adminPanel', ensureAdmin, (req,res) => {
    const info = req.body;
    res.status(200);
});
// Services route
router.get('/:id/services', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'Could not find the user' });
        }
        res.status(200).send(`Services for User ID: ${userId}`);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//staff directory
router.get('/:id/staff', (req,res) => {
    const staff_list_obj = getStaff();
    if (!staff_list_obj){
        res.status(400).json({msg :"Bad request. Problem finding staff records"});
    }
    res.status(200).json(staff_list_obj);
});
export default router;
