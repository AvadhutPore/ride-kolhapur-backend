const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup API
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, role } = req.body;

    let user = await User.findOne({ mobile });

    if (!user) {
       user = new User({name, mobile, role: role || "user",});
      await user.save();
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { mobile } = req.body;

    const user = await User.findOne({ mobile });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get all available drivers
router.get("/available-drivers", async (req, res) => {
  try {
    // In a real app, you'd filter by 'isOnline: true' or coordinates
    const drivers = await User.find({ role: "driver" });
    res.json({ success: true, drivers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;