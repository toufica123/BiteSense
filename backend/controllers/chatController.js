const Session = require("../models/Session");

exports.chat = async (req, res) => {
  const sessionId = req.headers["x-session-id"];
  const { message } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  const session = await Session.findOne({ sessionId });
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  session.messages.push({ role: "user", content: message });

  // MOCK AI RESPONSE (replace with Groq later)
  const reply = `AI remembers label: ${session.labelText}`;

  session.messages.push({ role: "assistant", content: reply });
  await session.save();

  res.setHeader("X-Session-Id", sessionId);
  res.json({ reply });
};
