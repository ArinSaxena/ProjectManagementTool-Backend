const express = require("express");
const User = require("../models/userModel");
const { getUserProfile, getAllusers, updateUser, deleteUser, changeUserRole } = require("../controllers/userControllers");

const router = express.Router;

router.get("/profile",getUserProfile)
router.post("/all-users",getAllusers)
router.put("/updateUser",updateUser)
router.delete("/delete/:id",deleteUser)
router.put("/change-role/:id", changeUserRole); 

module.exports = router;