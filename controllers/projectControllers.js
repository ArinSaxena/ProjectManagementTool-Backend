const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find({ deletedAt: null }); // only fetches projects with fields deletedAt as null

    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting projects!", error: error.message });
  }
};

const getTrashProjects = async (req, res) => {
  try {
    const trashedProjects = await Project.find({ deletedAt: { $ne: null } }); // Fetch only trashed projects
    return res.status(200).json(trashedProjects);
  } catch (err) {
    return res.status(500).json({
      message: "Error getting trashed projects!",
      error: error.message,
    });
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;
  try {
    //  const projects = await Project.find({ projectmanager: req.user._id })
    //     .populate("tasks");
    const projects = await Project.find({ _id: id }).populate("tasks");
    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting projects!", message: error.message });
  }
};

const createProject = async (req, res) => {
  const { name, description, deadline, projectmanager } = req.body;
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

const permanentlyDeleteProject = async (req, res) => {
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

const softDeleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ message: "Project moved to trash", project });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error moving task to trash", error: err.message });
  }
};

const restoreProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { deletedAt: null },
      { new: true }
    );
    res.status(200).json({ message: "Project restored ", project });
  } catch (err) {
    res.status(500).json({ message: "Error restoring task!", err });
  }
};

const deleteOldTrashProjects = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  try {
    await Task.deleteMany({ deletedAt: { $lte: oneMonthAgo } });
    console.log(`Deleted old trash projects`);
  } catch (err) {
    console.error("Error deleting old trash tasks:", err.message);
  }
};

const determineProjectStatus = async (ProjectId) => {
  const tasks = await Task.find({ project: ProjectId });
  if (tasks.length === 0) return "on-hold"; // No tasks → On-Hold
  const allCompleted = tasks.every((task) => task.status === "completed");
  const allTodo = tasks.every((task) => task.status === "todo");
  const hasInProgress = tasks.some((task) => task.status === "in-progress");
  const hasCompleted = tasks.some((task) => task.status === "completed");

  if (allCompleted) return "completed";
  if (allTodo) return "on-hold";
  if (hasInProgress || hasCompleted) return "active";
  return "active"; // Default fallback
};
const UpdateProjectStatus = async (req, res) => {
  try {
    const projects = await Project.find();
    for (let project of projects) {
      const newStatus = await determineProjectStatus(project._id);
      if (project.status !== newStatus) {
        await Project.findByIdAndUpdate(project._id, { status: newStatus });
      }
    }
    const updatedProjects = await Project.find();
    res.json(updatedProjects);
  } catch (err) {
    res.status(500).json({ error: "Error updating project statuses" });
  }
};
module.exports = {
  getAllProject,
  getTrashProjects,
  getProject,
  createProject,
  updateProject,
  softDeleteProject,
  restoreProject,
  deleteOldTrashProjects,
  permanentlyDeleteProject,
  UpdateProjectStatus,
};
