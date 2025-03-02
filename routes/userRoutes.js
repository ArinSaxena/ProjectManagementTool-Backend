const express = require("express");
const User = require("../models/userModel");
const {
  getUserProfile,
  changeUserRole,
  updateUser,
  getManagers,
  permananetlyDeleteUser,
  softDeleteUser,
  restoreUser,
  getAllUsers,
  getTrashUsers,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.get("/profile",authMiddleware,checkRole("admin","user","projectmanager"), getUserProfile);  //User can view their own profile
router.get("/all-users", authMiddleware,checkRole("admin","projectmanager"), getAllUsers); // adminOnly
router.get("/trash", authMiddleware,checkRole("admin","projectmanager"), getTrashUsers); 
router.get("/managers", authMiddleware,checkRole("admin"), getManagers); // adminOnly
router.put("/updateUser",authMiddleware,checkRole("user"),updateUser);   // User and admin can update profile
router.delete("/delete/:id", authMiddleware,checkRole("admin","projectmanager"), permananetlyDeleteUser); // adminOnly
router.put("/trash/:id",authMiddleware,checkRole("admin","projectmanager"),softDeleteUser); //Move to trash
router.put("/restore/:id",authMiddleware,checkRole("admin","projectmanager"),restoreUser)   // Restore from trash

// router.put("/change-role/:id", authMiddleware,checkRole("admin"), changeUserRole);// adminOnly

module.exports = router;


// const adminOnly = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Access denied" });
//   }
//   next();
// };

// module.exports = { protect, adminOnly };
