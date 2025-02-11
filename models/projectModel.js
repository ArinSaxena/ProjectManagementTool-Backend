const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dexcription: {
      type: String,
      required: true,
    },
    projectmanager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User managing  this project
      required: true,
    },
    members: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Users working on this project
    },
    tasks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Tasks associated with this project
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
