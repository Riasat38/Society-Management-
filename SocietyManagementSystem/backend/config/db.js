import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://ahmedriasat3822:Fri3nds\%3F@societydb.znxil.mongodb.net/mydb?retryWrites=true&w=majority&appname=societydb"
const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(uri)
        console.log(`MongoDb connected ${conn.connection.host}`);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
}

export default  connectDB; 