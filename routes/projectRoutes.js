const express = require("express")
const Project = require("../models/projectModel");
const { getProject, createProject, updateProject, deleteProject } = require("../controllers/projectControllers");

const router = express.Router();

router.get("/projects",getProject)
router.post("/create",createProject)
router.put("/update",updateProject)
router.delete("/delete",deleteProject)

module.exports = router