const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
const authMiddleware = async (req, res, next) => {
  // console.log("hello")
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("hello");
    if (!token) { 

      return res.status(401).json({ message: "Not authorized" });
    }
    // console.log("hello3")
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    // console.log(user)
    if (!user) {
     return res.status(401).json({ message: "User not found!" });
    }
    req.user= user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
