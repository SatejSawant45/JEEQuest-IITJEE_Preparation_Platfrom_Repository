import express from "express";
import { chatController } from "../controllers/chatbotController.js";
import { authOrAdmin } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Define rate limiting: max 20 requests per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  message: {
    message: "Too many requests to the AI Chatbot. Please try again after 15 minutes."
  }
});

// POST /api/chatbot - Send message to chatbot (Protected and Rate Limited)
router.post("/", authOrAdmin, chatLimiter, chatController);

export default router;
