`use strict`
import mongoose from "mongoose";
//comment schema
const commentSchema = new mongoose.Schema({
     user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
          required: true },
     content: {
         type: String,
         required: true,
         trim: true },
     timestamp: {
         type: Date,
         default: Date.now
        } 
});

//help post schema
const helpSchema = new mongoose.Schema({
    description :{
        type: String, required: true, trim: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    timestamp: { type: Date, default: Date.now},
    resolve_status:{
        resolved: Boolean,
        default: false
    },
    comments: [commentSchema]
});

export default mongoose.model("Help", helpSchema);