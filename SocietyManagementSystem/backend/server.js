`use strict`;

import dotenv from 'dotenv';
import cors from 'cors';
import express from "express";
import path from "path";
import passport from './config/auth.js';
//routes
import routes from "./Routes/routes.js";
import homeRoutes from "./Routes/homePageRoutes.js";
import adminRouter from "./Routes/adminRoutes.js";
//middlewares
import ensureAuthenticated from './Middleware/loggedIn.js';
import ensureAdmin from './Middleware/admincheck.js';

//config
import { fileURLToPath } from 'url';
import session from 'express-session';
import connectDB from "./config/db.js";

connectDB();
dotenv.config()

const port =  process.env.PORT || 4069;
const app = express();

app.use(cors({ 
  origin: 'http://localhost:3000', // Replace with your frontend's domain 
  methods: 'GET,POST,PUT,DELETE', // Allowable methods 
  allowedHeaders: 'Content-Type,Authorization', // Allowable headers 
  credentials: true  
}));

app.use(session({
    secret: 'your-secret-key',  // Set a secret key for session encryption
    resave: false,              // Do not resave session if it's not modified
    saveUninitialized: true,    // Save an uninitialized session
    cookie: { secure: false }   // Set `secure: true` in production if using HTTPS
  }));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(passport.initialize());
app.use(passport.session());
//routes

app.use("/society",routes); //initial and handlinng login

app.use("/society/homepage", homeRoutes);
app.use("/society/adminPanel",ensureAuthenticated, ensureAdmin, adminRouter);




app.listen(port,() => {
    console.log("Server Entry Point")
    console.log(`server is running on ${port}`);
});

