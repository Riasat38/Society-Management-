`use strict`;

import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import path from "path";

import routes from "./Routes/routes.js";
import { fileURLToPath } from 'url';
//import passport from 'passport';
import passport from './config/auth.js';
import session from 'express-session';
import connectDB from "./config/db.js"
connectDB();

const port =  4069;
const app = express();

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
app.use("/society",routes);



app.listen(port,() => {
    console.log("Server Entry Point")
    console.log(`server is running on ${port}`);
});

