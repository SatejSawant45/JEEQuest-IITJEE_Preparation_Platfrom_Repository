// routes/message.js
import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/save', async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.status(201).json({ message: "Message saved" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Error saving message" });
  }
});

export default router;
