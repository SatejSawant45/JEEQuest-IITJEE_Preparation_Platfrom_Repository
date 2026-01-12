import express from "express";
import { chatController } from "../controllers/chatbotController.js";

const router = express.Router();

// POST /api/chatbot - Send message to chatbot
router.post("/", chatController);

export default router;
