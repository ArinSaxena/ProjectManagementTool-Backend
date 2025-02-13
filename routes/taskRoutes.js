const express = require("express");

const { getTask, createTask, updateTask, deleteTask } = require("../controllers/taskControllers");
const Task = require("../models/taskModel");
const authMiddleware = require("../middleware/authMiddleware");
// const { updateMany } = require("../models/userModel");

const router = express.Router();

router.get("/task",authMiddleware,getTask)
router.post("/task",authMiddleware,createTask)
router.put("/task/:id",authMiddleware,updateTask)
router.delete("/task/:id",authMiddleware,deleteTask)

module.exports = router