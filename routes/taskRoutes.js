const { getTask, createTask, updateTask, deleteTask } = require("../controllers/taskControllers");
const Task = require("../models/taskModel");
// const { updateMany } = require("../models/userModel");

const router = express.Router();

router.get("/task",getTask)
router.post("/createTask",createTask)
router.put("/updateTask",updateTask)
router.delete("/task",deleteTask)

module.exports = router