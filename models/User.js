const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,

  role: {
    type: String,
    enum: ["user", "driver"],
    default: "user", // 👈 normal users by default
  },  
});

module.exports = mongoose.model("User", userSchema);