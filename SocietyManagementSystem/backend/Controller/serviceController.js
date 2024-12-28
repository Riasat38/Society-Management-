`use strict`

import User from "../Model/userModel.js";
import Service from "../Model/serviceModel.js";

export const postServiceRequest = async (req, res) => {
    const userId = req.user.id;
    const serviceType = req.params.serviceType;
    const description = req.body.description;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ error: 'Could not find the user' });
    }
    if (!serviceType) { 
        return res.status(400).json({ error: 'Service Type is required' });
    } 
    if(!user.usertype === 'resident'){
        return res.status(400).json({ error: 'This function is not for you' })
    }
    try{
        const serviceReq = {
            user: userId,
            description: description || null
        }
        switch(serviceType){
            case 'Electrician':
            case 'Plumber':
            case 'Other':
                serviceReq.serviceType = serviceType;
                const newReq = await Service.create(serviceReq);
                return res.status(201).json({service:newReq,
                    message: 'Service request posted successfully',
                redirectUrl: '/society/homepage/services'});
            default:
                return res.status(400).json({ error: 'Invalid Service Type' });
        }
        
    }catch(error){
        res.status(500).json({
            error: "Failed to post service request",
            details: error.message,
        });
    }
};

export const getServiceRequests = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({ error: 'Could not find the user' });
    }
    try {
        let serviceRequests;
        let serviceType;
        
        if (user.usertype === 'maintenance') {
            switch (user.role) {
                case 'Caretaker':
                   serviceType = 'Other';
                   break;
                case 'Electrician':
                    serviceType = 'Electrician';
                    break;
                case 'Plumber':
                    serviceType = 'Plumber';
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid User Type' });
            }
            serviceRequests = await Service.find({ serviceType: serviceType, resolve_status: false });
            return res.status(200).json({serviceRequests});
        }else {
            if (user.usertype === 'resident') {
                serviceRequests = await Service.find({ user: userId });
                return res.status(200).json({serviceRequests});
            } else if (user.admin) {
                serviceRequests = await Service.find({ resolve_status: false });
                return res.status(200).json({serviceRequests});
            }
        }      
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateServiceRequest = async (req,res) => {
    const userId = req.user.id;
    const user = await User.find(userId);
    const {serviceId} = req.params
    const {content} = req.body;
    const service = await Service.findById(serviceId);
    try{
        if (service.user.toString() !== userId || user.admin){ //user can not update the request
            return res.status(403).json({message: `Unauthorized User`,
                redirectUrl: '/society/homepage/services'
            })
        }
        if (!content){
            return res.status(204).json({message: `No data to be updated`,
                redirectUrl: '/society/homepage/services'
            })
        }
        if (!service){
            return res.status(404).json({message: `No data to be updated`,
                redirectUrl: '/society/homepage/services'
            })
        }
        service.content = content;
        await service.save();
        return res.status(200).json({message:`Request Modified`,
            redirectUrl: `/society/homepage/services/${serviceId}`
        });
    } catch(error){
        return res.status(500).json({error})
    }
};

export const resolveServiceRequest = async(req,res) => {
    const userId = req.user.id;
    const user = await User.find(userId);
    const {serviceId} = req.params;
    const {resolve_status} = req.body;
    const service = await Service.findById(serviceId);
    try{
        if (service.user.toString() !== userId ||  user.admin || service.serviceType !== user.role){ 
            return res.status(403).json({message: `Unauthorized User`,
                redirectUrl: '/society/homepage/services'
            })
        }
        if (!content){
            return res.status(204).json({message: `No data to be updated`,
                redirectUrl: '/society/homepage/services'
            })
        }
        if (!service){
            return res.status(404).json({message: `No data to be updated`,
                redirectUrl: '/society/homepage/services'
            })
        }
        service.resolve_status = resolve_status;
        await service.save();
        return res.status(200).json({message:`Request Resolved`,
            redirectUrl: `/society/homepage/services`}
        )  
    } catch(error){
        return res.status(500).json({error});
    }
};

export const deleteServiceRequest = async (req,res) => {
    const userId = req.user.id;
    const user = await User.find(userId);
    const {serviceId} = req.params
    const service = await Service.findById(serviceId);
    try{
        if (service.user.toString() !== userId &&  !user.admin ){ 
            return res.status(403).json({message: `Unauthorized User`,
                redirectUrl: '/society/homepage/services'
            })
        }
        if (!service){
            return res.status(404).json({message: `No data to be updated`,
                redirectUrl: '/society/homepage/services'
            })
        }
        await service.remove();
        return res.status(200).json({message:`Service Request Deleted`,
            redirectUrl: `/society/homepage/services`}
        )
    } catch(error){
        return res.status(500).json({error});
    }
};