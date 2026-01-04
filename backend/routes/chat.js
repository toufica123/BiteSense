const express = require("express");
const { chat } = require("../controllers/chatControllerImproved");
const Session = require("../models/Session");

const router = express.Router();

router.post("/", chat);

// Get all sessions for history
router.get("/history", async (req, res) => {
  try {
    const sessions = await Session.find({
      messages: { $exists: true, $not: { $size: 0 } },
      imageOriginalName: { $exists: true }
    })
    .sort({ updatedAt: -1 })
    .limit(50);

    const historyItems = sessions.map(session => ({
      id: session.sessionId,
      product: session.imageOriginalName || "Unknown Product",
      date: session.updatedAt,
      messageCount: session.messages.length,
      labelText: session.labelText
    }));

    res.json(historyItems);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Get specific session details
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.json({
      sessionId: session.sessionId,
      messages: session.messages,
      labelText: session.labelText,
      imageOriginalName: session.imageOriginalName,
      imageSize: session.imageSize,
      imageMimeType: session.imageMimeType,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    res.status(500).json({ error: "Failed to fetch session details" });
  }
});

// Clear session history
router.delete("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    // Keep only the initial analysis message
    const initialMessage = session.messages.find(m => 
      m.role === "assistant" && m.content.includes("analyzed") && m.content.includes("ingredients")
    );
    
    session.messages = initialMessage ? [initialMessage] : [];
    await session.save();
    
    res.json({ message: "Session history cleared", sessionId });
  } catch (error) {
    console.error("Error clearing session history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// Clean up old test sessions
router.delete("/cleanup", async (req, res) => {
  try {
    const result = await Session.deleteMany({
      sessionId: { $regex: /^test-/ }
    });
    
    res.json({ 
      message: "Test sessions cleaned up", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    res.status(500).json({ error: "Failed to cleanup sessions" });
  }
});

module.exports = router;
