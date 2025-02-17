const express = require("express")
const Project = require("../models/projectModel");
const { getProject, createProject, updateProject, deleteProject, getAllProject } = require("../controllers/projectControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();
router.get("/project",authMiddleware,checkRole("admin"),getAllProject)
router.get("/project/:id",authMiddleware,checkRole("projectmanager"),getProject)
router.post("/project",authMiddleware,checkRole("admin"),createProject)
router.put("/project/:id",authMiddleware,checkRole("admin","projectmanager"),updateProject)
router.delete("/project/:id",authMiddleware,checkRole("admin"),deleteProject)

module.exports = router