const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const rideRoutes = require("./routes/rideRoutes");

const app = express();
const server = http.createServer(app);

// 🔥 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io); // make io available in routes

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/ride", rideRoutes);

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// DB
mongoose.connect("mongodb+srv://ap_admin:ap_1994@taskmanager.xcnkxss.mongodb.net/ridekolhapur?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});