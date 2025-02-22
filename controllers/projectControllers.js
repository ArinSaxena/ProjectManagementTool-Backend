const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find()

    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting projects!",error : error.message });
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;   
  try {
    //  const projects = await Project.find({ projectmanager: req.user._id })
    //     .populate("tasks");
    const projects = await Project.find({_id:id})
        .populate("tasks");
    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting projects!", message: error.message });
  }
};

const createProject = async (req, res) => {
  const { name, description, deadline, projectmanager } =
    req.body;
    // console.log( { name, description, deadline, projectmanager })
  try {
    const createdProject = new Project({
      name,
      description,
      deadline,
      projectmanager,
    });
    // console.log(createdProject)

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
  const { name, description, status, deadline, users, projectmanager } =
    req.body;
  // console.log(name, description, status, users, deadline, projectmanager);
  try {
    // console.log("helo");
    const existingProject = await Project.findById(id);
    // console.log("helo1");

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    // console.log("hello2");
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, status, deadline, users, projectmanager },
      {
        new: true,
      }
    );
    // console.log(updatedProject);
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
    const deletedProject = await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting project!", error: err.message });
  }
};

module.exports = {
  getAllProject,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
