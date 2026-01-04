const crypto = require("crypto");

// Generate UUID v4 using crypto
function uuidv4() {
  return crypto.randomUUID();
}
const Session = require("../models/Session");

exports.uploadLabel = async (req, res) => {
  console.log("Upload request received");
  console.log("FILE:", req.file);
  console.log("BODY:", req.body);

  try {
    let sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Check for single file (multer.single() puts file in req.file)
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    console.log("Processing file:", req.file.filename);

    let session = await Session.findOne({ sessionId });

    if (!session) {
      session = new Session({
        sessionId,
        messages: [],
      });
    }

    // Store image metadata in MongoDB
    session.imagePath = req.file.path;
    session.imageOriginalName = req.file.originalname;
    session.imageMimeType = req.file.mimetype;
    session.imageSize = req.file.size;

    // Set initial label text
    session.labelText = "Uploaded image: " + req.file.originalname;
    session.messages.push({
      role: "assistant",
      content: "I've received your food label image! Ask me anything about the ingredients.",
    });

    await session.save();

    return res.json({
      message: "Upload successful",
      sessionId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};