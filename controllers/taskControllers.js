const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

const getAllTasksForProjectManager = async (req, res) => {
  // const { projectId } = req.params;

  try {
    // console.log(projectId);
    const tasks = await Task.find({ createdBy: req.user._id })
      .populate("project", "name")
      .populate("assignedTo", "name");
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks!", error: err.message });
  }
};

const getAssignedTasksForUser = async (req, res) => {
  try {
    // Fetch tasks assigned to the current user
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "project",
      "name"
    );

    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks!", error: err.message });
  }
};

const createTask = async (req, res) => {
  const { name, description, status, assignedTo, project, dueDate } = req.body;

  const createdBy = req.user._id;
  try {
    const newTask = new Task({
      name,
      description,
      status: status || "pending",
      assignedTo,
      project, // projectId
      createdBy,
      dueDate,
    });
    await newTask.save();

    await Project.findByIdAndUpdate(project, {
      $push: { tasks: newTask._id },
    });

    res.status(200).json({ message: "Task created successfully", newTask });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating task!", error: err.message });
  }
};
const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate status field
    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    task.status = status;
    await task.save();

    res
      .status(200)
      .json({ message: "Task status updated successfully", updatedTask: task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating task status!", error: err.message });
  }
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const editedTask = req.body;
  try {
    const task = await Task.findById(id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project?.projectmanager.toString() !== req.user._id) {
      // or do createdBy in Schema
      return res.status(403).json({
        message: "You can only update tasks from projects you manage",
      });
    }
    const updatedTask = await Task.findByIdAndUpdate(id, editedTask, {
      new: true,
    });
    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating task!", error: err.message });
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // if (task.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     message: "You can only delete tasks from projects you manage",
    //   });
    // }
    await Project.findByIdAndUpdate(task.project, { $pull: { tasks: id } });

    const deletedTask = await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task!", error: err.message });
  }
};

module.exports = {
  getAllTasksForProjectManager,
  getAssignedTasksForUser,
  createTask,
  editTask,
  updateTaskStatus,
  deleteTask,
};
