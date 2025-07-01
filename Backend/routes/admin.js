import express from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], adminController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], adminController.login);

router.get('/all', adminController.getAll);

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
    const messages = await Message.find({ room: { $regex: /^admin_/ } }).sort({ timestamp: -1 });

    const convoMap = new Map();

    for (const msg of messages) {
      const roomId = msg.room;
      if (!convoMap.has(roomId)) {
        const userId = roomId.split('_')[1];
        const user = await User.findById(userId);
        convoMap.set(roomId, {
          roomId,
          userName: user?.name || "Unknown",
          lastMessage: msg.content,
          lastMessageTime: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          unreadCount: 0 // Optional: logic to count unread messages
        });
      }
    }

    res.json(Array.from(convoMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});


router.get("/:id", async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  console.log(admin)
  if (!admin) return res.status(404).json({ error: "Admin not found" });
  res.json(admin);
});


router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
