const express = require("express");
const Session = require("../models/Session");

const router = express.Router();

// Get all sessions (history)
router.get("/", async (req, res) => {
    try {
        const sessions = await Session.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .select("sessionId imageOriginalName createdAt messages");

        const history = sessions.map(session => ({
            id: session.sessionId,
            product: session.imageOriginalName || "Unknown Product",
            date: session.createdAt,
            messageCount: session.messages.length,
            preview: session.messages.length > 0
                ? session.messages[session.messages.length - 1].content.substring(0, 100) + "..."
                : "No messages"
        }));

        res.json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// Get single session by ID
router.get("/:sessionId", async (req, res) => {
    try {
        const session = await Session.findOne({ sessionId: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json({
            sessionId: session.sessionId,
            imageOriginalName: session.imageOriginalName,
            imagePath: session.imagePath,
            messages: session.messages,
            createdAt: session.createdAt
        });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ error: "Failed to fetch session" });
    }
});

module.exports = router;
