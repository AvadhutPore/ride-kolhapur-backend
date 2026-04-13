const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");

// Create Ride
router.post("/create", async (req, res) => {
  try {
    const { userId, pickup, drop } = req.body;

    const ride = new Ride({
      userId,
      pickup,
      drop,
    });

    await ride.save();

    // 🔥 Emit to drivers
    const io = req.app.get("io");
    io.emit("newRide", ride);

    res.json({ success: true, ride });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// Cancel Ride
router.post("/cancel", async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { status: "cancelled" },
      { new: true }
    );

    res.json({ success: true, ride });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get Ride by ID
router.get("/:id", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    res.json({ success: true, ride });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// Get Ride Accept
router.post("/accept", async (req, res) => {
  const { rideId } = req.body;

  const ride = await Ride.findByIdAndUpdate(
    rideId,
    { status: "accepted" },
    { new: true }
  );

  const io = req.app.get("io");

  // 🔥 Notify user
  io.emit("rideAccepted", ride);

  res.json({ success: true });
});

module.exports = router;