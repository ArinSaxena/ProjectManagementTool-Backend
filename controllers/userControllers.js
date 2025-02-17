const User = require("../models/userModel");

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting User!", message: err.message });
  }
};

const getAllusers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const user = users.filter((user) => user.role !== "admin");
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting Users!", message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await User.findById(req.user._id);
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting User", error: err.message });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = role;
    await user.save();
    res.status(200).json({ message: `User role Updated to ${role}`, user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error changing  UserRole", error: err.message });
  }
};

module.exports = {
  getUserProfile,
  getAllusers,
  updateUser,
  deleteUser,
  changeUserRole,
};
