const { v4: uuidv4 } = require("uuid");
const Session = require("../models/Session");

exports.uploadLabel = async (req, res) => {
  console.log("FILE RECEIVED", req.file);
  try {
    let sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      sessionId = uuidv4();
    }

    // ✅ VERY IMPORTANT DEBUG
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    let session = await Session.findOne({ sessionId });

    if (!session) {
      session = new Session({
        sessionId,
        messages: [],
      });
    }

    // mock OCR result
    session.labelText = "Extracted ingredients from image";
    session.messages.push({
      role: "assistant",
      content: "Label analyzed successfully.",
    });

    await session.save();

    return res.json({
      message: "Upload successful",
      sessionId,
      filename: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};