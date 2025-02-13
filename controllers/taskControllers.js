const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

const getTask = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "projectmanager" || req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name")
        .populate("project", "name");
    } else if (req.user.role === "projectmanager") {
      // Find tasks only from projects managed by the current user
      const projects = await Project.find({
        projectmanager: req.user.id,
      }).select("_id");
      const projectIds = projects.map((p) => p._id);

      tasks = await Task.find({ project: { $in: projectIds } })
        .populate("project", "name")
        .populate("assignedTo", "name");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate(
        "project",
        "name"
      );
    }
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching task!", error: err.message });
  }
};

const createTask = async (req, res) => {
  const { name, description, status, assignedTo, project, dueDate } = req.body;
  try {
    if (req.user.role !== "projectmanager") {
      return res.status(403).json({ message: "Only Project Manager can create task" });

    }

    const newTask = new Task({
      name,
      description,
      status: status || "pending",
      assignedTo,
      project,
      dueDate,
    });

    await newTask.save();
    res.status(200).json({ message: "Task created successfully", newTask });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating task!", error: err.message });
  }
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const updatetask = req.body;
  try {
    if (req.user.role !== "projectmanager") {
      return res.status(403).json({ message: "Only Project Manager can update task" });

    }
    const task = await Task.findById(id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project.projectmanager.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update tasks from projects you manage" });
    }
    const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating task!", error: err.message });
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task!", error: err.message });
  }
};

module.exports = { getTask, createTask, updateTask, deleteTask };
