`use strict`;

import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import path from "path";

import routes from "./Routes/routes.js";
import { fileURLToPath } from 'url';

import connectDB from "./config/db.js"
connectDB()
    .then(() => {
        console.log("Server connected")
    })

const port =  4069;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));


const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use("/society",routes);


app.listen(port,() => {
    console.log("Server Entry Point")
    console.log(`server is running on ${port}`);
});


