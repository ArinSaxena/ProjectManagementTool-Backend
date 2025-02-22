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
    let users;
    let user;
    if (req.user.role === "admin") {
       users = await User.find().select("-password");
       user = users.filter((user) => user.role !== "admin");
    }else if(req.user.role === "projectmanager"){
      users =await User.find().select("-password");
       user = users.filter((user) => user.role === "user" )
    }
    else{
      res.status(400).json({message:"Unauthorized access!"})
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting Users!", message: err.message });
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

module.exports = {
  getUserProfile,
  getAllusers,
  updateUser,
  deleteUser,
  changeUserRole,
  getManagers,
};
