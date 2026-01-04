require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Basic middleware first
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));

// Import and register routes
const uploadRoutes = require("./routes/upload.js");
const chatRoutes = require("./routes/chat.js");

app.use("/uploadfile", uploadRoutes);
app.use("/chat", chatRoutes);

// Basic test endpoint
app.get("/greet", (req, res) => {
  res.json({ message: "Greetings Traveller" });
});

// Test upload endpoint
app.get("/test-upload", (req, res) => {
  res.json({ message: "Upload route test", timestamp: new Date() });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("- GET /greet");
  console.log("- GET /test-upload");
  console.log("- GET /uploadfile/health");
  console.log("- POST /uploadfile");
  console.log("- POST /chat");
  console.log("- GET /chat/history");
  console.log("- GET /chat/history/:sessionId");
  console.log("- DELETE /chat/history/:sessionId");
  console.log("- DELETE /chat/cleanup");
});
