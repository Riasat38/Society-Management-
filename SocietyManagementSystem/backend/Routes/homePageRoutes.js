`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";


import User from "../Model/userModel.js";
const router = express.Router();
//controllers
import {getStaff,createHelpPost,getPosts, getSinglePost, updateORresolveHelpPost,
    deleteHelpPost,addCommentToHelpPost, updateComment, deleteComment
} from "../Controller/homePageController.js";
import {getServiceRequests, postServiceRequest, updateServiceRequest,
    resolveServiceRequest, deleteServiceRequest} from "../Controller/serviceController.js";
import { postVisitorReq, showVisitorReq, updateVisitorReq, 
    deleteVisitorReq, resolveVisitorReq, visitorNotify} from "../Controller/visitorController.js";

import {getAllAnnouncements} from "../Controller/announcementController.js";
import { deleteRentPost, getALLrents, postRent, updateRentPost } from "../Controller/misc.js";


//HomePage  router
router.get("/",async (req,res) =>{ 
    const userId = req.user.id;
    const user = await User.findById(userId)

    if (!user){
        res.status(400).json({error : `Could not find the user`}).redirect('/scoiety/login');
    }
    const notice = getAllAnnouncements();
    res.status(200).json({user, notice});
});

//staff directory
router.get('/staff', async (req,res) => {
    const staff_list_obj = await getStaff();
    if (!staff_list_obj){
        res.status(400).json({msg :"Problem finding staff records"});
    }
    return res.status(200).json(staff_list_obj);
});


// Services route
router.get('/services', getServiceRequests ); 
//The service requests are filetered based on the usertype of the user
//the usertype will see services they are meant to see

router.post('/services/:serviceType', postServiceRequest);
router.put('/services/:serviceId/:action', (req,res) =>{
    const {action} = req.params;
    if (action === 'update'){
        updateServiceRequest(req,res);
    } else if(action === 'resolve'){
        resolveServiceRequest(req,res);
    }
});
router.delete('/services/:serviceId',deleteServiceRequest);


//help wall
router.get('/wall', getPosts);
router.post('/wall', createHelpPost);
router.put('/wall/:postid/', updateORresolveHelpPost); //only the user who has posted can update or resolve it
router.delete('/wall/:postId', deleteHelpPost);//admin can delete the post

router.get('/wall/:postId', getSinglePost); //showing a single post with comments
//comments
router.post('/wall/:helpPostId/comment', addCommentToHelpPost);
router.put('/wall/:helpPostId/comment/:commentId', updateComment)
router.delete('/wall/:helpPostId/comment/:commentId', deleteComment)

//requesting for a visitor to the gatekeep
router.get('/visitor', showVisitorReq); 

router.post('/visitor', async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.usertype === 'resident') {
        await postVisitorReq(req, res);
    } else if (user.usertype === 'maintenance' && user.role === 'Gatekeeper') {
        await visitorNotify(req, res);    //gatekeeper notifying users about people 
    }
});
router.delete('/visitor/:visitorPostId', deleteVisitorReq); 
router.put('/visitor/:visitorPostId/:action',async(req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const { action } = req.params;
    if (action === 'update' && user.usertype === 'resident') {
        await updateVisitorReq(req, res);
    } else if(action === 'resolve' && user.usertype === 'maintenance' && user.role === 'Gatekeeper'){
        await resolveVisitorReq(req, res);}
    else {
        return res.status(400).json({ message: 'Invalid action' });
    }
});

router.post('/rent-post', postRent);
router.get('/rent-post', getALLrents);
router.put('/rent-post/rentPostId', updateRentPost);
router.delete('/rent-post/rentPostId', deleteRentPost);

export default router;
