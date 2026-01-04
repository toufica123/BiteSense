const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: String, // "user" | "assistant"
  content: String,
});

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  labelText: String,
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
