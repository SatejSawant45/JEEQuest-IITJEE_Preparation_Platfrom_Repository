// routes/message.js
import express from 'express';
import Message from '../models/Message.js';
import upload from '../middlewares/upload.js';
import { uploadToS3 } from '../middlewares/s3Upload.js';

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

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { url } = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'chat-images'
    );

    res.status(200).json({ imageUrl: url });
  } catch (err) {
    console.error('Chat image upload error:', err);
    res.status(500).json({ message: 'Failed to upload chat image' });
  }
});

router.delete('/:roomId', async (req, res) => {
  try {
    await Message.deleteMany({ room: req.params.roomId });
    res.status(200).json({ message: 'Chat cleared successfully' });
  } catch (err) {
    console.error('Clear chat error:', err);
    res.status(500).json({ message: 'Error clearing chat' });
  }
});

export default router;
