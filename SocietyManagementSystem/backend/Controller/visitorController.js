`use strict`
import Visitor from "../Model/visitorModel.js";
import User from "../Model/userModel.js";
import { sendNotification } from "../config/mailer.js";

//an user expecting a visitor/delivery/package letting it known to the gatekeeper
// route : "/visitor", method : POST
export const postVisitorReq = async (req,res) => {
    try{
        const {delivery, deliveryType, expectedArrival, description } = req.body
        const userId = req.user.id;
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
                redirectUrl: '/society/homepage/visitor'
            })
        }
        const visitorData = {
            user : userId,
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
            redirectUrl : '/society/homepage/visitor'
        })
    } catch (error){
        return res.status(400).json({
            message : 'Required Data Missing'+error.message,
            redirectUrl: '/society/homepage/visitor'
        })
    }   
};

//route: "/visitor", method: GET, viewer: gatekeeper
export const showVisitorReq = async (req,res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (user.usertype === "Gatekeep"){
            const visitorQueue = Visitor.find({resolvestatus: false})
            .populate({
                path: 'User',
                select: "name username flatno"}).sort({ createdAt: 1 }).lean()
            return res.status(200).json(visitorQueue)
        }else{      //requests are filtered based on flatno
            const filtered_visitor_req = await Visitor.find({ flatno: user.flatno,resolvestatus: false })
            return res.status(200).json(filtered_visitor_req)
        }      
    }catch (error){
        return res.status(500).json({
            message:'Error while fetching data' + error.message,
            redirectUrl: '/society/homepage/visitor'
        })
    }  
};
// route : "/visitor/:visitorId", method : PUT, viewer: user
export const updateVisitorReq = async (req,res) => {
    try { 
        const { visitorId } = req.params; 
        const { delivery, deliveryType, expectedArrival, description } = req.body
        const userId = req.user.id;
        const updatedVisitorData = {};

        const visitor = await Visitor.findById(visitorId);
        if (!visitor) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/visitor'
            });
        }
        if (visitor.user.toString() !== userId) { 
            return res.status(403).json({ message: 'Unauthorized access', 
                redirectUrl: '/society/homepage/visitor' }); 
        }

        if (delivery) updatedVisitorData.delivery = delivery; 
        if (deliveryType) updatedVisitorData.deliveryType = deliveryType; 
        if (expectedArrival) updatedVisitorData.expectedArrival = expectedArrival; 
        if (description) updatedVisitorData.description = description
        const updatedVisitor = await Visitor.findByIdAndUpdate(visitorId, updatedVisitorData, { new: true });
        if (!updatedVisitor) { 
            return res.status(404).json({ message: 'Visitor request not found', 
                redirectUrl: '/society/homepage/visitor' }); 
        }

        return res.status(200).json({ message: 'Visitor request updated successfully', 
            data: updatedVisitor, 
            redirectUrl: '/society/homepage/visitor' });
    }catch (error) { 
        return res.status(500)
        .json({ message: 'Error updating visitor request: ' + error.message, 
            redirectUrl: '/society/homepage/visitor' }); }
};

// route : "/visitor/:visitorId", method : DELETE, viewer: user
export const deleteVisitorReq = async (req, res) => {
    try {
        const { visitorId } = req.params;
        const userId = req.user.id;  // Assuming you have a middleware to set req.userId
        const visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/visitor'
            });
        }

        if (visitor.user.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized access',
                redirectUrl: '/society/homepage/visitor'
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
// route : "/visitor/:visitorId", method : PUT, viewer: gatekeeper
export const resolveVisitorReq = async (req, res) => {
    try {
        const { visitorId } = req.params;
        const destination = req.body.destination;
        const userId = req.user.id;  
        const visitor = await Visitor.findById(visitorId).populate('user', 'name email username');
        const user = User.find(userId)
        if (!visitor_obj) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/visitor'
            });
        }
        if (user.role !== "Gatekeeper" || user.usertype !== "maintenance") {
            return res.status(403).json({
                message: 'Unauthorized access',
                redirectUrl: '/society/homepage/visitor'
            });
        }
        if (visitor.resolve_status){
            return res.status(400).json({
                message: 'Visitor request already resolved',
                redirectUrl: '/society/homepage//visitor'
            });
        }
        if (destination !== user.flatno) {
            const flag = "suspicious"
         } 
        visitor.resolve_status = true;
        visitor.destination = destination;
        await visitor.save();

        const requester_email = visitor.user.email;
        const requester = visitor.user.username;
        
        const resolver = user.username;
        let message;
        if (visitor.delivery) {
            message = `Dear ${requester},\n Your expected delivery ${visitor.deliveryType} has arrived`;
        }else{
            message = `Dear ${requester},\nYour expected visitor has arrived.`
        }
        ;
        await sendNotification(requester_email, resolver, message);
        return res.status(200).json({
            message: 'Visitor request resolved successfully',
            redirectUrl: '/society/homepage/visitor'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error resolving visitor request: ' + error.message,
            redirectUrl: '/society/homepage/visitor'
        });
    }
};
// route : "/visitor/notify", method : POST, viewer: gatekeeper
export const visitorNotify = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const {description, delivery,deliverytype, guestname,guests, destination} = req.body;

    if (!guests || !destination || !contact ){ 
        return res.status(400).json({
            message: 'Required data missing',
            redirectUrl: '/society/homepage/visitor'
        });
    }
    const visitorData = {
        user: userId,
        delivery: delivery ? true : false,
        deliveryType: deliverytype ? deliverytype : null,
        description: description ? description : null,
        guestname: guestname,
        guests: guests,
        destination: destination,
        contact: contact
    };
    const guest = await Visitor.create(visitorData);
    const to_whom = await User.find({usertype: "resident", flatno: destination}).lean();

    let message;
    for(let person in to_whom){
        const email = person.email;
        if (delivery){
            message = `Dear ${person.name},\n There is a ${guest.deliveryType} intended for ${person.flatno}.`}
        else{
            message = `Dear ${person.name},\n ${guest.guestname} guest/guests intended for ${person.flatno}.`}
        await sendNotification(email, user.name, message);
    }  
    guest.resolve_status = true;
    await guest.save();         //resolve status true is essential for showing unresolved requests
};
