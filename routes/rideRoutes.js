const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");



// Get All Rides
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find().sort({ _id: -1 }); // latest first
    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// Create Ride
router.post("/create", async (req, res) => {
  try {
    const { userId, driverId, pickup, drop } = req.body;

    const ride = new Ride({
      userId,
      driverId, // Store the driver the user picked
      pickup,
      drop,
      status: "searching"
    });

    await ride.save();

    const io = req.app.get("io");
    // Emit to everyone, but the DriverPanel will filter by driverId
    io.sockets.emit("newRideRequest", ride); 

    res.json({ success: true, ride });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// 🏁 Complete Ride
router.post("/complete", async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { status: "completed" },
      { new: true }
    );
    
    // Notify the user that they have arrived
    const io = req.app.get("io");
    io.sockets.emit("rideCompleted", ride);

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


// ✅ Update Accept Ride to include Vehicle Info for the User
router.post("/accept", async (req, res) => {
  try {
    const { rideId, driverId } = req.body;
    
    // Get driver details
    const User = require("../models/User");
    const driver = await User.findById(driverId);

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { 
        status: "accepted", 
        driverId: driverId,
        // Optional: Save vehicle snapshot into the ride record
        vehicleModel: driver.vehicleInfo?.model,
        plateNumber: driver.vehicleInfo?.plateNumber
      },
      { new: true }
    );

    const io = req.app.get("io");
    io.sockets.emit("rideAccepted", ride);

    res.json({ success: true, ride });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Get ride history for a specific user
router.get("/user-history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const rides = await Ride.find({ userId }).sort({ _id: -1 }); // Latest rides first
    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;