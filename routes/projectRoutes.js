const express = require("express")
const Project = require("../models/projectModel");
const { getProject, createProject, updateProject, deleteProject } = require("../controllers/projectControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/projects",authMiddleware,getProject)
router.post("/create",authMiddleware,createProject)
router.put("/update",authMiddleware,updateProject)
router.delete("/delete",authMiddleware,deleteProject)

module.exports = router