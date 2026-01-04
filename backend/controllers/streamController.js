const Session = require("../models/Session");
const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.streamChat = async (req, res) => {
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

  try {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Session-Id', sessionId);

    // Create the prompt for ingredient suggestions
    const ingredientPrompt = `Based on the following ingredients: ${message}, please provide recipe suggestions and cooking tips. Consider the ingredients available and suggest creative ways to use them together.`;

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: ingredientPrompt
        }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null
    });

    let fullReply = "";
    
    // Stream the response
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullReply += content;
        res.write(content);
      }
    }

    // Save the complete response to session
    session.messages.push({ role: "assistant", content: fullReply });
    await session.save();

    res.end();

  } catch (error) {
    console.error("Groq API Error:", error);
    const fallbackReply = `I'm having trouble processing your ingredients right now. Please try again later. Your ingredients: ${message}`;
    
    session.messages.push({ role: "assistant", content: fallbackReply });
    await session.save();

    res.write(fallbackReply);
    res.end();
  }
};