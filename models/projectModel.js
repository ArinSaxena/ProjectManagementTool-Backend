const mongoose = require("mongoose");
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
    projectmanager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // projectmanager managing  this project
      required: true,
    },
    members: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Users working on this project
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Tasks associated with this project
    }],
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
