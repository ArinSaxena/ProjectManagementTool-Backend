const mongoose = require("mongoose");
const { MONGO_URI } = require("./envCongif");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error!",err));
