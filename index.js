require('dotenv').config();
require("./config/connectiondb")
const express = require("express");
const cors = require("cors");


const app = express();

app.use(express.json()); 

app.use(
    cors({
        origin:"http://localhost:3000",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type", "Authorization"], 
    })
)
const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Server is running on port${port}`)
});