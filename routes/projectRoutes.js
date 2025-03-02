const express = require("express")
const Project = require("../models/projectModel");
const { getProject, createProject, updateProject, getAllProject, UpdateProjectStatus, permanentlyDeleteProject, softDeleteProject, restoreProject, getTrashProjects } = require("../controllers/projectControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();
router.get("/all-projects",authMiddleware,checkRole("admin"),getAllProject)
router.get("/trash",authMiddleware,checkRole("admin"),getTrashProjects)  // called in trash component
router.get("/project/:id",authMiddleware,checkRole("projectmanager"),getProject)
router.post("/createProject",authMiddleware,checkRole("admin"),createProject)
router.put("/project/:id",authMiddleware,checkRole("admin","projectmanager"),updateProject)
router.put("/trash/:id",authMiddleware,checkRole("admin"),softDeleteProject); //Move to trash
router.put("/restore/:id",authMiddleware,checkRole("admin"),restoreProject)   // Restore from trash
router.delete("/project/:id",authMiddleware,checkRole("admin"),permanentlyDeleteProject)
router.get("/update-project-status",UpdateProjectStatus)   // no middleware as it is automated no user is interfering in this api 

module.exports = router