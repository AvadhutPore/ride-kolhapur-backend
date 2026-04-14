const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  role: {
    type: String,
    enum: ["user", "driver"],
    default: "user", // 👈 normal users by default
  },  
  // 🚗 Added Vehicle Info
  vehicleInfo: {
    model: { type: String, default: "" },      // e.g., "Honda Activa"
    plateNumber: { type: String, default: "" }, // e.g., "MH09 AB 1234"
    type: { type: String, default: "bike" }    // bike, auto, car
  }
});

module.exports = mongoose.model("User", userSchema);