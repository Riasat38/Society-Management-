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

helpSchema.pre('save', function (next) { 
    if (this.resolve_status.resolved) { 
        this.remove() .then(() => { 
            console.log('Help post and its comments have been deleted'); 
            next(); }) 
            .catch(error => next(error)); 
        } else { 
            next(); 
        } 
});

export default mongoose.model("Help", helpSchema);