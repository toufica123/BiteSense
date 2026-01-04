const Session = require("../models/Session");
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// System prompt for the food ingredient analyzer
const SYSTEM_PROMPT = `You are BiteSense AI, an expert nutritionist and food ingredient analyzer. 
You help users understand what's in their food by analyzing ingredient labels from images.

When analyzing ingredients:
1. Provide detailed explanations of ingredients and their purposes
2. Identify any concerning ingredients or additives
3. Highlight potential allergens (nuts, dairy, gluten, soy, etc.)
4. Provide health insights and nutritional information
5. Suggest healthier alternatives when appropriate
6. Answer specific questions about ingredients

Be helpful, concise, and focus on health and nutrition advice. Use the extracted ingredient text from the uploaded image as your primary reference.`;

// Convert image to base64
function imageToBase64(imagePath) {
  const absolutePath = path.resolve(imagePath);
  if (!fs.existsSync(absolutePath)) {
    console.log("Image not found at:", absolutePath);
    return null;
  }
  const imageBuffer = fs.readFileSync(absolutePath);
  return imageBuffer.toString("base64");
}

// Get MIME type from file extension
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

exports.chat = async (req, res) => {
  const sessionId = req.headers["x-session-id"];
  const { message } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  try {
    // Find the session with uploaded image info
    const session = await Promise.race([
      Session.findOne({ sessionId }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]);

    if (!session) {
      return res.status(404).json({ error: "Session not found. Please upload an image first." });
    }

    // Special case: return session history if requested
    if (message === "__GET_HISTORY__") {
      return res.json({
        sessionId: session.sessionId,
        messages: session.messages,
        labelText: session.labelText,
        imageInfo: {
          originalName: session.imageOriginalName,
          size: session.imageSize,
          mimeType: session.imageMimeType
        }
      });
    }

    // Add user message to session
    session.messages.push({ role: "user", content: message });

    console.log("Processing chat message with extracted ingredients");

    // Build conversation history with ingredient context
    const conversationHistory = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add ingredient context if available
    if (session.labelText && session.labelText !== `Uploaded image: ${session.imageOriginalName}`) {
      conversationHistory.push({
        role: "system",
        content: `EXTRACTED INGREDIENTS FROM UPLOADED IMAGE "${session.imageOriginalName}": ${session.labelText}\n\nUse this ingredient list as the primary reference for answering questions. The user is asking about these specific ingredients.`
      });
    } else if (session.imageOriginalName) {
      conversationHistory.push({
        role: "system",
        content: `Context: The user previously uploaded a food label image named "${session.imageOriginalName}" but ingredient extraction may still be in progress.`
      });
    }

    // Add previous messages (last 8 for context)
    const recentMessages = session.messages.slice(-8);
    for (const msg of recentMessages) {
      conversationHistory.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      });
    }

    console.log("Sending request to Groq with ingredient context");

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversationHistory,
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Save assistant reply to session
    session.messages.push({ role: "assistant", content: reply });
    await session.save();
    console.log("Messages saved to database");

    res.json({ reply, sessionId });

  } catch (error) {
    console.error("Error in chat:", error);

    // Fallback response with ingredient context if available
    let fallbackReply = "I apologize, but I'm having trouble processing your request at the moment.";
    
    try {
      const session = await Session.findOne({ sessionId });
      if (session && session.labelText && session.labelText !== `Uploaded image: ${session.imageOriginalName}`) {
        fallbackReply += ` However, I can see that your uploaded image contains these ingredients: ${session.labelText}. Please try asking your question again.`;
      }
    } catch (dbError) {
      console.error("Error accessing session for fallback:", dbError);
    }

    res.status(500).json({
      error: "Service error",
      reply: fallbackReply,
      sessionId
    });
  }
};