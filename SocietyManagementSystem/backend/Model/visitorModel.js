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
    resolve_status:{
        type: Boolean,
        default: false
    }
},
{timestamps : true});

const guestVisitorSchema = new mongoose.Schema({
    destination:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    visitor_name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    flatno:{
        type: String,
        required: false
    },
    purpose:{
        type: String,
        required: true
    },   
});

const GuestVis= mongoose.model("GuestVis", guestVisitorSchema);
const Visitor= mongoose.model("Visitor", visitorSchema);

export { Visitor, GuestVis };