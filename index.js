require('dotenv').config();
require("./config/connectiondb")
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const projectRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")


const app = express();

app.use(express.json()); 

app.use(
    cors({
        origin:"http://localhost:3000",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type", "Authorization"], 
    })
)
app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes);
app.use("/api/project",projectRoutes)
app.use("/api/task",taskRoutes)

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Server is running on port${port}`)
});