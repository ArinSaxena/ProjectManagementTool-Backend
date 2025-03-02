require("dotenv").config();
require("./config/connectiondb");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Import cron jobs
require("./cronJobs");  // 👈 This ensures cron jobs start running automatically


app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:5173/",
    origin:"*",
    // methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
