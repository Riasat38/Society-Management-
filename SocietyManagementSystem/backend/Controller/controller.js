`use strict`
import User from "../Model/userModel.js";

export const getUser = async(req,res) => {
    const user = await User.find()

    res.status(200).json(user)
};

export const createUser = async (req,res) => {
    const {username, flatno, usertype} = await req.body || {};
    console.log(username);
    console.log(flatno);
    console.log(usertype);
    if (!username || !usertype || !flatno){
        res.status(400);
        throw new Error(`Some data missing`)
    }
    const user = await User.create({
        username: username,
        flatno: flatno,
        usertype: usertype
    });
    console.log(user);
    return res.status(200).json(user);
};