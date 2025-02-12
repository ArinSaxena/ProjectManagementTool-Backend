const Task = require("../models/taskModel");

const getTask = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "marchant" || req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name")
        .populate("project", "name");
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
    const newTask = new Task({
      name,
      description,
      status: status || pending,
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
  const { task } = req.body;
  try {
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
