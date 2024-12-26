`use strict`

import User from "../Model/userModel.js";
import Help from '../Model/helpPost.js';

export const getStaff = async (req,res) => {
    try{
        const staffs = User.find({ usertype: 'maintenance'}).lean();
        return staffs
    } catch(error){
        console.log(error)
        return error
    }
};

export const createHelpPost = async (req,res) => {
     try {
        const {help_descr} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId); 
         if (!user) { 
            throw new Error("User not found"); 
        }  
        if (!help_descr) { 
            return res.status(400).json({ error: 'Description cannot be empty',
                redirectUrl : `/society/homepage/ ${userId}/wall`
             }); 
        }
        const helpPost = await Help.create({ description: help_descr, user: userId });
        console.log('Help Post Created:', helpPost); 
        return res.status(201).json({
            msg : "Post Created Successfully!",
            data: helpPost,
            redirectUrl : "/society/homepage/wall"
        })
    } catch (error) { 
        console.error('Error creating help post:', error);
        return res.status(400).json(error);
    } 
};

export const getPosts = async(req,res) => {
    try{
        const userId = req.user.id;
        const posts = await Help.find({resolve_status : false }).sort({ createdAt: -1 }) 
        .populate('user','name email').lean();
        if (!posts){
            return res.status(400).json({error : "No Posts Available"});
        }
        return res.status(200).json(posts);        //returning an object containing alll unresolved posts
    } catch(error){
        return res.status(400).json(error);
    }  
};

export const getSinglePost = async (req, res) => {
    try {
      const userId = req.user.id;    // From middleware
      const { postId } = req.params;    // Get the specific post ID from the URL
      const helpPost = await Help.findById(postId).populate('comments.user', 'name username').lean(); 
      
      if (!helpPost) {
        return res.status(404).json({ error: 'Help post not found' });
      }
      
      return res.status(200).json(helpPost); // Return the specific post data
    } catch (error) {
      console.error('Error fetching help post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateORresolveHelpPost = async (req, res) => {
    try {
        const helpPostId = req.params.postId;
        const { description,resolve } = req.body;
        const userId = req.user.id;

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }
        if (helpPost.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description cannot be empty' });
        }
        if (helpPost.resolve_status.resolved) {
            return res.status(400).json({ error: 'Cannot update a resolved post' });
        }
        helpPost.description = description;
        helpPost.resolve_status = resolve
        await helpPost.save();

        res.status(200).json({
            message: 'Help post updated successfully',
            data: helpPost,
            redirectUrl: `/society/homepage/wall/${helpPostId}`, 
        });
    } catch (error) {
        console.error('Error updating help post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteHelpPost = async (req, res) => {
    try {
        const helpPostId = req.params.postId;
        const userId = req.user.id;
        const user = await User.findById(userId);

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }
        if (helpPost.user.toString() !== userId && !user.admin) { //admin can only delete a post
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }
        await helpPost.remove();
        return res.status(302).json({
            message: 'Help post deleted successfully',
            redirectUrl: '/society/homepage/wall',
        });
    } catch (error) {
        console.error('Error deleting help post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const addCommentToHelpPost = async (req, res) => { 
    try { 
        const { content } = req.body; 
        const userId = req.user.id;  //req.body
        const {helpPostId} = req.params;
        const helpPost = await Help.findById(helpPostId).populate('comments.user', 'name username');; 
        if (!helpPost) { 
            return res.status(404).json({ error: 'Help post not found' }); 
        }
        if (!userId) {
            return res.status(401).json({ error: 'User must be logged in to comment' });
        } 
        if (!content || content.trim() === "") {
            return res.status(400).json({ error: 'Comment content cannot be empty' });
        }
        const newComment = { user: userId, content: content};

        helpPost.comments.push(newComment); 
        await helpPost.save();
        return res.status(201).json({
            comments:helpPost.comments,
            redirectUrl: `/society/homepage/wall/${helpPostId}`
        });
    } catch (error) { 
        console.error('Error adding comment:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
};

export const updateComment = async (req, res) => {
    try {
        const { helpPostId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }

        const comment = helpPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this comment' });
        }
        comment.content = content;
        await helpPost.save();

        return res.status(200).json({
            message: 'Comment updated successfully',
            post : helpPost.comments
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { helpPostId, commentId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }

        const comment = helpPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== userId && !user.admin) { //user can delte comment
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        comment.remove();
        await helpPost.save();

        return res.status(200).json({
            message: 'Comment deleted successfully',
            post : helpPost.comments
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
let flats_for_rent = [];
export const postRent = async (req,res) => {
    const userId = req.user.id;
    const {rent_amount, availablefrom, description} = req.body;
    try{
        if (!rent_amount || !availablefrom){
            return res.status(400).json({error : "Please provide all the details"});
        }
        flats_for_rent.push({userId,rent_amount, availablefrom, description});
        return res.status(200).json(flats_for_rent);
    } catch(error){
        return res.status(500).json({error : error.message});
    }
};
export const getALLrents = async (req,res) => {
    return res.status(200).json(flats_for_rent);
};

export const deleteRentPost = async (req,res) => {
};