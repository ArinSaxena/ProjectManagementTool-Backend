const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ACCESS_TOKEN_SECRET } = require("../config/envCongif");
const authMiddleware = async (req, res, next) => {
  try {
    // console.log(req.headers);
    const token = req.headers.authorization?.split(" ")[1];
   
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
