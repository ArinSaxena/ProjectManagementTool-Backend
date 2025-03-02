const cron = require("node-cron");
const { deleteOldTrashTasks } = require("./controllers/taskControllers");
const { deleteOldTrashProjects } = require("./controllers/projectControllers");
const { deleteOldTrashUser } = require("./controllers/userControllers");

// Runs every day at midnight (00:00 AM)
cron.schedule("*/30 * * * * *", async () => {
  console.log("Running scheduled task: Deleting old trash tasks...");
  try{
    await deleteOldTrashTasks();
    await deleteOldTrashProjects();
    await deleteOldTrashUser();
  }catch(err){
    console.error("Error deleting trash data:", err.message);

  }
  console.log("✅ Cron job initialized: Auto-deleting old trash data every 30 seconds.");

});

module.exports = cron;
