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

When analyzing a food label image:
1. Read and list all the ingredients you can see
2. Identify any concerning ingredients or additives
3. Highlight potential allergens (nuts, dairy, gluten, soy, etc.)
4. Provide health insights and nutritional information
5. Suggest healthier alternatives when appropriate

Be helpful, concise, and focus on health and nutrition advice.`;

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

    // Add user message to session
    session.messages.push({ role: "user", content: message });

    // Check if this is the first message and we have an image
    const isFirstUserMessage = session.messages.filter(m => m.role === "user").length === 1;
    const hasImage = session.imagePath && fs.existsSync(session.imagePath);

    let messages = [];

    if (isFirstUserMessage && hasImage) {
      // First message with image - use vision model
      console.log("Using vision model with image:", session.imagePath);

      const base64Image = imageToBase64(session.imagePath);
      const mimeType = getMimeType(session.imageOriginalName || "image.jpg");

      if (base64Image) {
        messages = [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${SYSTEM_PROMPT}\n\nThe user uploaded a food label image. Please analyze it and describe the ingredients you see. Then answer their question: "${message}"`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ];

        // Use vision model
        const completion = await client.chat.completions.create({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: messages,
          temperature: 0.7,
          max_completion_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't analyze the image.";

        // Save to session
        session.messages.push({ role: "assistant", content: reply });
        await session.save();
        console.log("Vision analysis complete, saved to database");

        return res.json({ reply, sessionId });
      }
    }

    // For follow-up messages or if no image, use text model
    console.log("Using text model for follow-up conversation");

    // Build conversation history
    const conversationHistory = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add context about uploaded image
    if (session.imageOriginalName) {
      conversationHistory.push({
        role: "system",
        content: `Context: The user previously uploaded a food label image named "${session.imageOriginalName}".`
      });
    }

    // Add previous messages (last 10 for context)
    const recentMessages = session.messages.slice(-10);
    for (const msg of recentMessages) {
      conversationHistory.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      });
    }

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

    // Check if it's a model not available error
    if (error.message?.includes("model") || error.status === 400) {
      console.log("Vision model error, falling back to text model");

      // Fallback response
      return res.json({
        reply: "I apologize, but I'm having trouble analyzing the image at the moment. Could you please type out the ingredients you see on the food label, and I'll help you understand them?",
        sessionId: req.headers["x-session-id"]
      });
    }

    res.status(500).json({
      error: "Service error",
      message: error.message
    });
  }
};