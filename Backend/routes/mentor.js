import express from 'express';
import { body } from 'express-validator';
import * as mentorController from '../controllers/mentorController.js';
import User from '../models/User.js';
import Mentor from '../models/Mentor.js';
import Message from '../models/Message.js';
import { mentorAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], mentorController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], mentorController.login);

router.get('/profile', mentorAuth, mentorController.getProfile);

router.put('/profile', mentorAuth, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('title').optional().trim(),
  body('company').optional().trim(),
  body('location').optional().trim(),
  body('experience').optional().trim(),
  body('probableActiveTime').optional().trim(),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('phone').optional().trim(),
  body('website').optional().trim(),
  body('linkedin').optional().trim(),
  body('github').optional().trim(),
  body('avatar').optional().trim(),
], mentorController.updateProfile);

router.get('/all', mentorController.getAll);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, "name _id");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get('/conversations', async (req, res) => {
  try {
    const messages = await Message.find({ room: { $regex: /^mentor_/ } }).sort({ timestamp: -1 });

    const convoMap = new Map();

    for (const msg of messages) {
      const roomId = msg.room;
      if (!convoMap.has(roomId)) {
        const userId = roomId.split('_')[1];
        const user = await User.findById(userId);
        convoMap.set(roomId, {
          roomId,
          userName: user?.name || "Unknown",
          userId,
          lastMessage: msg.content,
          lastMessageTime: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          unreadCount: 0
        });
      }
    }

    res.json(Array.from(convoMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.get('/:id', async (req, res) => {
  const mentor = await Mentor.findById(req.params.id);
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });
  res.json(mentor);
});

export default router;
