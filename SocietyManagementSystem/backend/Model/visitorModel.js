import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    delivery:{
        type: Boolean,
        required:true
    },
    deliveryType: {
        type: String,
        required: function () {
            return this.delivery; 
        },
        enum: ['Package', 'Document', 'Food', 'Other'],
    }, 
    expectedArrival :{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: false 
    }, 
    resolvestatus:{
        type: Boolean,
        default: false
    }
},
{timestamps : true});

export default mongoose.model("Visitor", visitorSchema);