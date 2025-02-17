const express = require("express");

const { getTask, createTask, updateTask, deleteTask, updateTaskStatus, editTask, getAllTask, getAllTasksForProjectManager, getAssignedTasksForUser } = require("../controllers/taskControllers");
const Task = require("../models/taskModel");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
// const { updateMany } = require("../models/userModel");

const router = express.Router();

router.get("/task/",authMiddleware,checkRole("projectmanager"),getAllTasksForProjectManager)
router.get("/task/user",authMiddleware,checkRole("user"),getAssignedTasksForUser)
router.put("/task/status/:id",authMiddleware,checkRole("user"),updateTaskStatus)
router.post("/task",authMiddleware,checkRole("projectmanager"),createTask)
router.put("/task/edit/:id",authMiddleware,checkRole("projectmanager"),editTask)
router.delete("/task/:id",authMiddleware,checkRole("projectmanager"),deleteTask)

module.exports = router