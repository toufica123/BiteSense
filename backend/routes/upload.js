const express = require("express");
const multer = require("multer");
const { uploadLabel } = require("../controllers/uploadController");

const router = express.Router();

// Simple multer setup
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload route
router.post("/", (req, res, next) => {
  console.log("=== ROUTE HIT ===");
  upload.single("uploaded_image")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }
    console.log("=== CALLING CONTROLLER ===");
    uploadLabel(req, res, next);
  });
});

module.exports = router;