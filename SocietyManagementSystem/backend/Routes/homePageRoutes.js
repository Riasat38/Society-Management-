`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";


import User from "../Model/userModel.js";
const router = express.Router();
//controllers
import {getStaff,createHelpPost,getPosts, getSinglePost, resolveHelpPost,
    deleteHelpPost,addCommentToHelpPost, updateComment, deleteComment
} from "../Controller/homePageController.js";

import { postVisitorReq, showVisitorReq, updateVisitorReq, 
    deleteVisitorReq, resolveVisitorReq } from "../Controller/visitorController.js";

import {getAllAnnouncements, createAnnouncement, deleteAnnouncement} from "../Controller/announcementController.js";



//HomePage  router
router.get("/:id", (req,res) =>{ 
    const user = req.userId;
    if (!user){
        res.status(400).json({error : `Could not find the user`}).redirect('/scoiet/login');
    }
    const notice = getAllAnnouncements();
    res.status(200).json({user, notice});
});


//router.use("/:id/services",serviceRoutes);

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
        res.status(400).json({msg :"Problem finding staff records"});
    }
    return res.status(200).json(staff_list_obj);
});

//help wall
router.get('/:id/wall', getPosts);
router.post('/:id/wall', createHelpPost);
router.put('/:id/wall/:postid/:action', (req,res) => {
    const { action } = req.params;
    if (action === 'resolve') {
        resolveHelpPost(req, res);
    } else if (action === 'update') {
        updateHelpPost(req, res);
    } else {
        return res.status(400).json({ message: 'Invalid action' });
    }
}); 
router.delete('/:id/wall/:postId', deleteHelpPost);

router.get('/:id/wall/:postId', getSinglePost); //showing a single post with comments
//comments
router.post('/:id/wall/:helpPostId/comment', addCommentToHelpPost);
router.put('/:id/wall/:helpPostId/comment/:commentId', updateComment)
router.delete('/:id/wall/:helpPostId/comment/:commentId', deleteComment)

//requesting for a visitor to the gatekeep
router.get('/:id/visitor', showVisitorReq); //when visited the route visiting request will be shown grouped by flat.
router.post('/:id/visitor', postVisitorReq);
router.delete('/:id/visitor/:visitorId', deleteVisitorReq); 
router.put('/:id/visitor/:visitorId',async(req,res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    const { action } = req.params;
    if (action === 'update' && user.usertype === 'resident') {
        updateVisitorReq(req, res);
    } else if(action === 'resolve' && user.usertype === 'gatekeeper'){
        resolveVisitorReq(req, res);}
});
export default router;
