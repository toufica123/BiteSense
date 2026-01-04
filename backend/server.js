require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const uploadRoutes = require("./routes/upload.js");
const chatRoutes = require("./routes/chat.js");
const streamRoutes = require("./routes/stream.js");

const app = express();

app.use(cors());
app.use("/uploadfile", uploadRoutes);
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (optional for testing)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/greet", (req, res) => {
  res.json({ message: "Greetings Traveller" });
});

app.use("/chat", chatRoutes);
app.use("/stream", streamRoutes);

// History routes
const historyRoutes = require("./routes/history.js");
app.use("/history", historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
