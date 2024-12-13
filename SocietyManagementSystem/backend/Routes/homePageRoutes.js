`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";

import passport from "passport";
import User from "../Model/userModel.js";
const router = express.Router();
import ensureAuthenticated from './Middleware/loggedIn.js';
import ensureAdmin from './Middleware/admincheck.js'
import addUserIdToUrl from "../Middleware/urlencoder.js";

router.use(ensureAuthenticated);
router.use(addUserIdToUrl);

router.get("/:id", ensureAdmin, (req,res) =>{ 
    const user = req.user;
    if (!user){
        res.status(400).json({error : `Could not find the user`});
    }
    res.status(200).json(user);

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

export default router;
