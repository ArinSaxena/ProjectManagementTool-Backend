const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const sessions = new Set();
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const generateToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // if (!name || !password || !email || !role) {
    //   return res
    //     .status(400)
    //     .json({ message: "All filds are required." });
    // }
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is invalid",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ name: name, password: hash, email, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Username not registered!" });
  }

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res.status(401).json({ message: "Incorrect password!" });
  }
  const tokenData = { id: user._id, role: user.role };
  const refresh_token = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30h",
  });
  sessions.add(refresh_token);
  console.log(sessions)
  const token = generateToken(tokenData);

  return res.status(200).json({
    token,
    refresh_token,
  });
};

const refreshToken = (req, res) => {
  const refresh_token = req.body.token;

  if (!sessions.has(refresh_token)) {
    return res.status(400).json({ message: "You need to log in" });
  }

  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, token_data) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Forbidden", error: err.message });
      }

      const token = generateToken({ id: token_data.id });
      return res.json({ token });
    }
  );
};

const logout = (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "No operation, invalid token" });
    }

    const refreshToken = authHeader.split(" ")[1];

    console.log("Extracted Refresh Token:", refreshToken);
    console.log(sessions);

    if (!sessions.has(refreshToken)) {
      return res.status(400).json({ message: "No operation" });
    }
    sessions.delete(refreshToken);
    console.log(sessions);

    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error" });
  }
};
module.exports = { register, login, refreshToken, logout };
