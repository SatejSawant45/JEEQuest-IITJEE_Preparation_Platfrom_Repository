import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a chat controller
export const chatController = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file" 
      });
    }

    // Initialize Gemini API inside the function to ensure env vars are loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Set up streaming response headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Start a chat session with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });

    // Stream the response
    const result = await chat.sendMessageStream(latestMessage);

    for await (const chunk of result.stream) {
      const textDelta = chunk.text();
      
      if (textDelta) {
        res.write(`0:${JSON.stringify({ type: "text-delta", textDelta })}\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error("Chatbot error:", error);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: "Failed to get response from AI",
        details: error.message 
      });
    } else {
      // If headers already sent, write error in stream format
      res.write(`0:${JSON.stringify({ 
        type: "text-delta", 
        textDelta: "\n\nSorry, I encountered an error. Please try again." 
      })}\n`);
      res.end();
    }
  }
};
