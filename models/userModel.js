const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "projectmanager", "user"],
    required: true,
  },
  title:{
    type:String
  },
  deletedAt:{
    type:Date,
    default:null
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
