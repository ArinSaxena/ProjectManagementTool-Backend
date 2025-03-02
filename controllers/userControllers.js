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

const getAllUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "admin") {
      users = await User.find({
        deletedAt: null,
        role: { $ne: "admin" },
      }).select("-password");
    } else if (req.user.role === "projectmanager") {
      users = await User.find({ deletedAt: null, role: "user" }).select(
        "-password"
      );
    } else {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    return res.status(200).json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting users!", error: err.message });
  }
};

const getTrashUsers = async (req, res) => {
  try {
    const trashedUsers = await User.find({ deletedAt: { $ne: null } }); // Fetch only trashed users
    return res.status(200).json(trashedUsers);
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "Error getting trashed users!",
        error: err.message,
      });
  }
};

const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "projectmanager" }).select(
      "-password -email"
    );

    res.status(200).json(managers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Getting managers!", message: err.message });
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
const getUser = async (req, res) => {
  // const id=  req.params.id;
  // console.log(id);
  const id = req.user._id;
  try {
    const user = await User.findById(id).select("-password");
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      noOfcartItems: user?.cartItems?.length || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
const permananetlyDeleteUser = async (req, res) => {
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

const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ message: "User moved to trash", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error moving task to trash", error: err.message });
  }
};

const restoreUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deletedAt: null },
      { new: true }
    );
    res.status(200).json({ message: "User restored ", user });
  } catch (err) {
    res.status(500).json({ message: "Error restoring task!", err });
  }
};
const deleteOldTrashUser = async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  try {
    await User.deleteMany({ deletedAt: { $lte: oneMonthAgo } });
    console.log("Deleted old trash Users" );
  } catch (err) {
    console.error("Error deleting old trash users:", err.message);
  }
}
;

module.exports = {
  getUserProfile,
  getAllUsers,
  getTrashUsers,
  updateUser,
  permananetlyDeleteUser,
  changeUserRole,
  softDeleteUser,
  restoreUser,
  deleteOldTrashUser,
  getManagers,
};
