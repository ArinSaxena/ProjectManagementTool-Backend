const express = require("express");
const User = require("../models/userModel");
const {
  getUserProfile,
  getAllusers,
  deleteUser,
  changeUserRole,
  updateUser,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.get("/profile",authMiddleware,checkRole("user"), getUserProfile);  //User can view their own profile
router.post("/all-users", authMiddleware,checkRole("admin"), getAllusers); // adminOnly
router.put("/updateUser",authMiddleware,checkRole("user"),updateUser);   // User and admin can update profile
router.delete("/delete/:id", authMiddleware,checkRole("admin"), deleteUser); // adminOnly
// router.put("/change-role/:id", authMiddleware,checkRole("admin"), changeUserRole);// adminOnly

module.exports = router;


// const adminOnly = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Access denied" });
//   }
//   next();
// };

// module.exports = { protect, adminOnly };
