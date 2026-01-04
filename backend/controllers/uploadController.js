const crypto = require("crypto");
const { extractTextFromImage, analyzeIngredients } = require("../services/ocrService");

// Generate UUID v4 using crypto
function uuidv4() {
  return crypto.randomUUID();
}
const Session = require("../models/Session");

exports.uploadLabel = async (req, res) => {
  console.log("=== UPLOAD CONTROLLER CALLED ===");
  console.log("Upload request received");
  console.log("FILE:", req.file);

  try {
    let sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Check for single file (multer.single() puts file in req.file)
    if (!req.file) {
      console.log("No file found in request");
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

    console.log("Starting ingredient extraction...");
    
    // Extract ingredients from uploaded image using OCR
    const extractedIngredients = await extractTextFromImage(req.file.path);
    console.log("Extracted ingredients:", extractedIngredients);

    // Analyze the ingredients for insights
    const analysis = analyzeIngredients(extractedIngredients);
    console.log("Ingredient analysis:", analysis);

    // Store extracted ingredients in session.labelText
    session.labelText = extractedIngredients;
    
    // Create detailed initial message with analysis
    const analysisMessage = createAnalysisMessage(extractedIngredients, analysis, req.file.originalname);
    
    session.messages.push({
      role: "assistant",
      content: analysisMessage,
    });

    await session.save();

    console.log("Upload and analysis completed successfully");

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

/**
 * Create a detailed analysis message for the user
 */
function createAnalysisMessage(ingredientText, analysis, filename) {
  let message = `I've analyzed your food label image "${filename}" and extracted the following ingredients:\n\n`;
  
  message += `**Ingredients Found:**\n${ingredientText}\n\n`;
  
  message += `**Quick Analysis:**\n`;
  message += `• Total ingredients: ${analysis.totalIngredients}\n`;
  
  if (analysis.allergens.length > 0) {
    message += `• ⚠️ Potential allergens: ${analysis.allergens.join(', ')}\n`;
  }
  
  if (analysis.additives.length > 0) {
    message += `• 🧪 Additives/preservatives found: ${analysis.additives.slice(0, 3).join(', ')}${analysis.additives.length > 3 ? '...' : ''}\n`;
  }
  
  if (analysis.isOrganic) {
    message += `• 🌱 Contains organic ingredients\n`;
  }
  
  if (analysis.hasArtificialColors) {
    message += `• 🎨 Contains artificial colors\n`;
  }
  
  if (analysis.hasHighFructoseCornSyrup) {
    message += `• ⚠️ Contains high fructose corn syrup\n`;
  }
  
  message += `\nFeel free to ask me any questions about these ingredients, their health effects, or alternatives!`;
  
  return message;
}