const express = require("express");
const User = require("../models/userModel");
const { register, login, logout, refreshToken } = require("../controllers/authControllers");

const router = express.Router();

router.post("/login",login)
router.post("/register",register)
router.post("/token", refreshToken)
router.delete("/logout",logout);

module.exports = router