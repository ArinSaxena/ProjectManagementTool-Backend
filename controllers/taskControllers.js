const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks!", error: err.message });
  }
};
const getAllTasksForProjectManager = async (req, res) => {
  const { status } = req.query;
  const filter = { createdBy: req.user._id };
  console.log(status);
  try {
    if (status) {
      filter.status = status;
    }
    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name");
    // console.log(tasks);
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks!", error: err.message });
  }
};

const getAssignedTasksForUser = async (req, res) => {
  try {
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
  console.log(name, description, status, assignedTo, project, dueDate);
  try {
    const newTask = new Task({
      name,
      description,
      status: status || "todo",
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
  console.log(status);

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const validStatuses = ["todo", "inProgress", "completed"];
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

// soft delete task
const softDeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ message: "Task moved to trash", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error moving task to trash", error: err.message });
  }
};

// Restore task from trash

const restoreTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { deleteAt: null },
      { new: true }
    );
    res.status(200).json({ message: "Task restored ", task });
  } catch (err) {
    res.status(500).json({ message: "Error restoring task!", err });
  }
};

// const permanentlyDeleteTask = async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   try {
//     const task = await Task.findById(id).populate("project");
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     await Project.findByIdAndUpdate(task.project, { $pull: { tasks: id } });

//     const deletedTask = await Task.findByIdAndDelete(id);
//     res.status(200).json({ message: "Task deleted successfully" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error deleting task!", error: err.message });
//   }
// };
const permanentlyDeleteTask = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted permanently" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error deleting task permanenlty!",
        error: err.message,
      });
  }
};

// Auto delete task older than one month

const deleteOldTrashTasks = async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  try {
    await Task.deleteMany({ deletedAt: { $lte: oneMonthAgo } });
    console.log("Old trash tasks deleted successfully");
  } catch (err) {
    console.error("Error deleting old trash tasks:", err.message);
  }
};
// Schedule Auto-Delete (Runs every 24 hours)
setInterval(deleteOldTrashTasks, 24 * 60 * 60 * 1000);

module.exports = {
  getAllTasks,
  getAllTasksForProjectManager,
  getAssignedTasksForUser,
  createTask,
  editTask,
  updateTaskStatus,
  softDeleteTask,
  restoreTask,
  permanentlyDeleteTask,
};
