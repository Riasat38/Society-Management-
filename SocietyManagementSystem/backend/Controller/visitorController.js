`use strict`
import {Visitor,GuestVis} from "../Model/visitorModel.js";
import User from "../Model/userModel.js";
import { sendNotification } from "../config/mailer.js";
export const postVisitorReq = async (req,res) => {
    try{
        const {delivery, deliveryType, expectedArrival, description } = req.body
        const userId = req.params.id;
        let flag = false;
        if (!delivery || !expectedArrival){
            flag = true;
        }
        if (delivery && !deliveryType){
            flag = true;
        }
        if (flag){
            return res.status(400).json({
                message : 'Required Data Missing',
                redirectUrl: '/society/homepage/' + userId + '/visitor'
            })
        }
        const visitorData = {
            deliver: delivery,
            expectedArrival: expectedArrival,
        }
        if (description){
            visitorData.description = description; 
        }
        if (delivery && deliveryType){
            visitorData.deliveryType = deliveryType
        }else{
            throw new Error("Required Data Missing")
        }
        const visitor = await Visitor.create(visitorData);

        console.log(visitor)
        return res.status(200).json({
            message : "RequestPosted",
            data : visitor,
            redirectUrl : '/society/homepage/' + userId + '/visitor'
        })
    } catch (error){
        return res.status(400).json({
            message : 'Required Data Missing'+error.message,
            redirectUrl: '/society/homepage/' + userId + '/visitor'
        })
    }   
};


export const showVisitorReq = async (req,res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user.usertype === "Gatekeep"){
            const visitorQueue = Visitor.find({resolvestatus: false, flatno: user.flatno}).sort({ createdAt: 1 })
            .populate({
                path: 'User',
                select: "username flatno"}).lean()
            return res.status(200).json(visitorQueue)
        }else{      //requests are filtered based on flatno
            const filtered_visitor_req = await Visitor.find({ flatno: flatno,resolvestatus: false })
            return res.status(200).json(filtered_visitor_req)
        }      
    }catch (error){
        return res.status(500).json({
            message:'Error while fetching data' + error.message,
            redirectUrl: '/society/homepage/' + userId + '/visitor'
        })
    }  
};

export const updateVisitorReq = async (req,res) => {
    try { 
        const { visitorId } = req.params; 
        const { delivery, deliveryType, expectedArrival, description } = req.body
        const userId = req.params.id;
        const updatedVisitorData = {};

        const visitor = await Visitor.findById(visitorId);
        if (!visitor) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/' + userId + '/visitor'
            });
        }
        if (visitor.user.toString() !== userId) { 
            return res.status(403).json({ message: 'Unauthorized access', 
                redirectUrl: '/society/homepage/' + userId + '/visitor' }); 
        }

        if (delivery) updatedVisitorData.delivery = delivery; 
        if (deliveryType) updatedVisitorData.deliveryType = deliveryType; 
        if (expectedArrival) updatedVisitorData.expectedArrival = expectedArrival; 
        if (description) updatedVisitorData.description = description
        const updatedVisitor = await Visitor.findByIdAndUpdate(visitorId, updatedVisitorData, { new: true });
        if (!updatedVisitor) { 
            return res.status(404).json({ message: 'Visitor request not found', 
                redirectUrl: '/society/homepage/' + userId + '/visitor' }); 
        }

        return res.status(200).json({ message: 'Visitor request updated successfully', 
            data: updatedVisitor, 
            redirectUrl: '/society/homepage/' + userId + '/visitor' });
    }catch (error) { 
        return res.status(500)
        .json({ message: 'Error updating visitor request: ' + error.message, 
            redirectUrl: '/society/homepage/' + userId + '/visitor' }); }
};

export const deleteVisitorReq = async (req, res) => {
    try {
        const { visitorId } = req.params;
        const userId = req.params.id;  // Assuming you have a middleware to set req.userId
        const visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/' + userId + '/visitor'
            });
        }

        if (visitor.user.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized access',
                redirectUrl: '/society/homepage/' + userId + '/visitor'
            });
        }

        await Visitor.findByIdAndDelete(visitorId);

        return res.status(200).json({
            message: 'Visitor request deleted successfully',
            redirectUrl: '/society/homepage/' +userId + '/visitor'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting visitor request: ' + error.message,
            redirectUrl: '/society/homepage/' + userId + '/visitor'
        });
    }
};

export const resolveVisitorReq = async (req, res) => {
    try {
        const { visitorId } = req.params;
        const userId = req.params.id;  
        const visitor = await Visitor.findById(visitorId).populate('user', 'email username');
        const user = User.find(userId)
        if (!visitor_obj) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/' + userId + '/visitor'
            });
        }
        if (user.role !== "Gatekeeper" || user.usertype !== "maintenance") {
            return res.status(403).json({
                message: 'Unauthorized access',
                redirectUrl: '/society/homepage/' + userId + '/visitor'
            });
        }
        if (visitor.resolve_status){
            return res.status(400).json({
                message: 'Visitor request already resolved',
                redirectUrl: '/society/homepage/' + req.userId + '/visitor'
            });
        }
        visitor.resolve_status = true;
        await visitor.save();

        const requester_email = visitor.user.email;
        const requester = visitor.user.username;
        
        const resolver = user.username;
        if (visitor.delivery) {
            const message = `Your expected delivery ${visitor.deliveryType} has arrived`;
        }else{
            const message = `Your expected visitor has arrived`
        }
        ;
        await sendNotification(requester_email, resolver, message);
        return res.status(200).json({
            message: 'Visitor request resolved successfully',
            redirectUrl: '/society/homepage/' + userId + '/visitor'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error resolving visitor request: ' + error.message,
            redirectUrl: '/society/homepage/' + userId + '/visitor'
        });
    }
};

export const visitorNotify = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const {to_whom, name, phone, flatno, purpose} = req.body;

    if (!name || !phone || !purpose) {
        return res.status(400).json({
            message: 'Required data missing',
            redirectUrl: '/society/homepage/' + userId + '/visitor'
        });
    }
    const temp = await User.find({ usernmae: to_whom  })
    .populate('user','flatno').lean();
    let destination;
    for(let obj in temp){
        if (obj.flatno === flatno){
            destination = obj;
        }
    }
    
};