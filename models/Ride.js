const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  userId: String,
  pickup: String,
  drop: String,
  status: {
  type: String,
  enum: ["searching", "accepted", "started", "completed", "cancelled"],
  default: "searching",
},
});

module.exports = mongoose.model("Ride", rideSchema);