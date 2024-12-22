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

import {getAllAnnouncements} from "../Controller/announcementController.js";



//HomePage  router
router.get("/:id",async (req,res) =>{ 
    const userId = req.params.id;
    const user = await User.findById(userId)

    if (!user){
        res.status(400).json({error : `Could not find the user`}).redirect('/scoiet/login');
    }
    const notice = getAllAnnouncements();
    res.status(200).json({user, notice});
});

//staff directory
router.get('/:id/staff', async (req,res) => {
    const staff_list_obj = await getStaff();
    if (!staff_list_obj){
        res.status(400).json({msg :"Problem finding staff records"});
    }
    return res.status(200).json(staff_list_obj);
});


// Services route
router.get('/:id/services/', async (req, res) => {
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

router.post('/:id/services/:serviceType', async (req, res) => {
    const type = req.params.serviceType;
    postServiceRequest(req, res);
    if (type === 'Electrician'){
        res.status(200).send('Electrician Service');
    }
    else if (type === 'Plumber'){
        ;
    }
    else if (type === 'Other'){
        res.status(200).send('Other Service');
    }
    else{
        res.status(400).send('Invalid Service Type');
    }
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
    } else if(action === 'resolve' && user.usertype === 'maintenance' && user.role === 'Gatekeeper'){
        resolveVisitorReq(req, res);}
    else {
        return res.status(400).json({ message: 'Invalid action' });
    }
});
export default router;
