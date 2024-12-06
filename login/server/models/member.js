const mongoose=require('mongoose')
const MemberSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const MemberModel=mongoose.model("member",MemberSchema)
module.exports= MemberModel