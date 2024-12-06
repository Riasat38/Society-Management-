const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const app= express()
const MemberModel=require("./models/member")
const bcrypt = require("bcrypt"); 
app.use(express.json())
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/member")
app.listen(3001,()=>{
    console.log("Server is running")
})
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const member = await MemberModel.create({ name, email, password: hashedPassword });
        res.status(201).json(member); // Return created member
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

