'use strict';

import mongoose from "mongoose";

const quranClassSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    student_name :{
        type: String,
        required: function(){
            return this.user && this.user.usertype === 'resident';}  
    },
    teacherName: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    schedule: {
        type: String,
        required: true, // e.g., "Monday & Wednesday: 5-6 PM"
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Mixed"], 
    },
},{timestamps : true});

const QuranClass = mongoose.model("QuranClass", quranClassSchema);
export default QuranClass;
