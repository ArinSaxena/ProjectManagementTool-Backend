const mongoose = require("mongoose");
const Task = require("./taskModel");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    projectmanager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // projectmanager managing  this project
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId, // ????????????????
        ref: "User", // Users working on this project
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    deadline: {
      type: Date,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

ProjectSchema.pre("findOneAndDelete", async function (next) {
  const projectId = this.getQuery()._id;

  try {
    await Task.deleteMany({ project: projectId }); // Delete all related tasks
    next();
  } catch (err) {
    next(err);
  }
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
