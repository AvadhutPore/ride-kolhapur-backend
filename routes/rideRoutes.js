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

module.exports = router;