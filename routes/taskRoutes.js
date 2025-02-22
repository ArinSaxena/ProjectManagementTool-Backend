const express = require("express");

const { getTask, createTask, updateTask, updateTaskStatus, editTask, getAllTask, getAllTasksForProjectManager, getAssignedTasksForUser, getAllTasks, softDeleteTask, restoreTask, permanentlyDeleteTask } = require("../controllers/taskControllers");
const Task = require("../models/taskModel");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
// const { updateMany } = require("../models/userModel");

const router = express.Router();

router.get("/all-tasks/",authMiddleware,checkRole("admin"),getAllTasks)
router.get("/task",authMiddleware,checkRole("projectmanager"),getAllTasksForProjectManager)
router.get("/task/user",authMiddleware,checkRole("user"),getAssignedTasksForUser)
router.put("/status/:id",authMiddleware,checkRole("user"),updateTaskStatus)
router.post("/task",authMiddleware,checkRole("projectmanager"),createTask)
router.put("/task/edit/:id",authMiddleware,checkRole("projectmanager"),editTask)

router.put("/task/trash/:id",authMiddleware,checkRole("admin","projectmanager"),softDeleteTask); //Move to trash
router.put("/task/restore/:id",authMiddleware,checkRole("admin","projectmanager"),restoreTask)   // Restore from trash
router.delete("/task/:id",authMiddleware,checkRole("projectmanager","admin"),permanentlyDeleteTask)

module.exports = router