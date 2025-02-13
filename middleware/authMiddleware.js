const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).status({ message: "User not found!" });
    }
    req.user= user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
