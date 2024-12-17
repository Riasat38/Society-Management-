`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";

import passport from "passport";
import User from "../Model/userModel.js";
const router = express.Router();
//controllers
import {getStaff,createHelpPost,getPosts, getSinglePost, resolveHelpPost,
    deleteHelpPost,addCommentToHelpPost, updateComment, deleteComment
} from "../Controller/homePageController.js";
//middlewares
import ensureAdmin from './Middleware/admincheck.js'


//HomePage  router
router.get("/:id", (req,res) =>{ 
    const user = req.userId;
    if (!user){
        res.status(400).json({error : `Could not find the user`}).redirect('/scoiet/login');
    }
    res.status(200).json({user});
});

//AdMIN
import adminRoutes from "./adminRoutes.js";
router.use("/:id/adminPanel", ensureAdmin, adminRoutes);


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
router.get('/:id/wall', getPosts);
router.post('/:id/wall', createHelpPost);
router.get('/:id/wall/:postId', getSinglePost);
router.put('/:id/wall/:action', (req,res) => {
    const { action } = req.params;
    if (action === 'resolve') {
        resolveHelpPost(req, res);
      } else if (action === 'update') {
        updateHelpPost(req, res);
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
}); 
router.delete('/:id/wall', deleteHelpPost);

//comments
router.post('/:id/wall/comments', addCommentToHelpPost);
router.put('/:id/wall/comments', updateComment)
router.delete('/:id/wall/comments', deleteComment)


export default router;
