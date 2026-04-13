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

    res.json({ success: true, ride });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

module.exports = router;