`use strict`;

import express from "express";
import path from "path";
import routes from "./Routes/routes.js"

const port = process.env.PORT || 11078;
const app = express();
app.listen(port,() => {
    console.log("Server Entry Point")
    console.log(`server is running on ${port}`);
});

app.use("/society",routes);




