const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup API
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile } = req.body;

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ name, mobile });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;