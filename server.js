const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const rideRoutes = require("./routes/rideRoutes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/ride", rideRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// Connect DB
mongoose.connect(
  "mongodb+srv://ap_admin:ap_1994@taskmanager.xcnkxss.mongodb.net/ridekolhapur?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});