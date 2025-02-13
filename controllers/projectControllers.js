const Project = require("../models/projectModel");

const getProject = async (req, res) => {
  const { id } = req.body; // manager id to get it's projects
  try {
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.find();
    } else if (req.user.role === "projectmanager") {
      projects = await Project.find().populate({ projectmanager: id });
    }
    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting projects!", message: error.message });
  }
};

const createProject = async (req, res) => {
  const {
    name,
    description,
    tasks,
    status,
    deadline,
    members,
    projectmanager,
  } = req.body;
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create project" });

    }
    const createdProject = new Project({
      name,
      description,
      tasks: tasks || [],
      status,
      deadline,
      members,
      projectmanager,
    });
   
    await createdProject.save();
    res
      .status(200)
      .json({ message: "Project created successfully", createdProject });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating project!", error: err.message });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { project } = req.body;
  try {
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (
      req.user.role !== "admin" &&
      req.user.role !== existingProject.projectmanager.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You cannot update this project" });
    }
    const updatedProject = await Project.findByIdAndUpdate(id, project, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Project updated successfully", updatedProject });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating project!", error: err.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete project" });
    }
    const deletedProject = await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting project!", error: err.message });
  }
};

module.exports = { getProject, createProject, updateProject, deleteProject };
