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
        const userId = req.params.id;
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
            redirectUrl : "/society/homepage/"+ userId+"/wall"
        })
    } catch (error) { 
        console.error('Error creating help post:', error);
        return res.status(400).json(error);
    } 
};

export const getPosts = async(req,res) => {
    try{
        const userId = req.params.id;
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
      const userId = req.params.id;    // From middleware
      const { postId } = req.params;    // Get the specific post ID from the URL
      const helpPost = await Help.findById(postId).populate('comments.user', 'username').lean(); 
      
      if (!helpPost) {
        return res.status(404).json({ error: 'Help post not found' });
      }
      
      return res.status(200).json(helpPost); // Return the specific post data
    } catch (error) {
      console.error('Error fetching help post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  

export const resolveHelpPost = async (req, res) => { 
    try { 
        const helpPostId = req.params.postId; 
        const helpPost = await Help.findById(helpPostId); 
        const userId = req.params.id;
        const {resolve} = req.body
        if (!helpPost) { 
            return res.status(404).json({ error: 'Help post not found' }); 
        }
        if (helpPost.resolve_status) {
            return res.status(400).json({ error: 'Help post is already resolved' });
        }
        if (helpPost.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to resolve this post' });
        }

        helpPost.resolve_status = true; 
        await helpPost.save(); 
        return res.status(200).json({
            message: 'Help post resolved successfully',
            redirectUrl: '/society/homepage/' + req.userId + '/wall',
        }); 
    } catch (error) { 
        console.error('Error resolving help post:', error); 
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateHelpPost = async (req, res) => {
    try {
        const helpPostId = req.params.postId;
        const { description } = req.body;
        const userId = req.params.id;

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
        await helpPost.save();

        res.status(200).json({
            message: 'Help post updated successfully',
            data: helpPost,
            redirectUrl: '/society/homepage/' + userId + '/wall', 
        });
    } catch (error) {
        console.error('Error updating help post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteHelpPost = async (req, res) => {
    try {
        const helpPostId = req.params.postId;
        const userId = req.params.id;

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }

        if (helpPost.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        await helpPost.remove();

        res.status(302).json({
            message: 'Help post deleted successfully',
            redirectUrl: '/society/homepage/' + req.userId + '/wall',
        });
    } catch (error) {
        console.error('Error deleting help post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const addCommentToHelpPost = async (req, res) => { 
    try { 
        const { content } = req.body; 
        const userId = req.params.id;  //req.body
        const {helpPostId} = req.params;
        const helpPost = await Help.findById(helpPostId).populate('comments.user', 'username');; 
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
        return res.status(201).json(helpPost.comments);
    } catch (error) { 
        console.error('Error adding comment:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
};

export const updateComment = async (req, res) => {
    try {
        const { helpPostId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.params.id;

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
        const userId = req.params.id;

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }

        const comment = helpPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== userId) {
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
