`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";

import passport from "passport";
import User from "../Model/userModel.js";
const router = express.Router();
import {getStaff,createHelpPost,getPosts, getBloodDonations, addBloodDonation, getAllLostAndFound, createLostAndFound, updateLostAndFoundStatus, deleteLostAndFound} from "../Controller/homePageController.js";
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

//help wall
router.get('/:id/wall', (req,res) => {
    try{
        const posts = getPosts();
        if (!posts){
            throw new Error("No posts Found");
        }
        res.status(200).json(posts);        //returning an object containing alll unresolved posts
    } catch(error){
        res.status(400).json(error);
    }
});
router.post('/:id/wall', (req,res) => {
    try{
        const help_descr = req.body.description
        const userId = req.params.id
        const help_post = createHelpPost(help_descr,userId)
        if (help_post){
             res.status(200).redirect('/society/homepage/:id/wall')
        }else{
            throw new Error("Post unsuccessful");
        }

    }catch(error){
        res.status(400).json(error)
    }
});
//bloodDonation
router.get("/:id/blood-donation", async (req, res) => {
    try {
        await getBloodDonations(req, res);
    } catch (error) {
        console.error("Error in fetching blood donations:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// POST: Add a new blood donation record
router.post("/:id/blood-donation", async (req, res) => {
    try {
        await addBloodDonation(req, res);
    } catch (error) {
        console.error("Error in adding blood donation:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

//lostandfound
router.post('/:id/lostAndFound', async (req, res) => {
    try {
      await createLostAndFound(req, res);
    } catch (error) {
      console.error('Error in creating Lost and Found item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to update the status of a Lost or Found item
  router.patch('/:id/lostAndFound/:itemId', async (req, res) => {
    try {
      await updateLostAndFoundStatus(req, res);
    } catch (error) {
      console.error('Error in updating Lost and Found item status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to delete a Lost or Found item
  router.delete('/:id/lostAndFound/:itemId',ensureAdmin, async (req, res) => {
    try {
      await deleteLostAndFound(req, res);
    } catch (error) {
      console.error('Error in deleting Lost and Found item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;
