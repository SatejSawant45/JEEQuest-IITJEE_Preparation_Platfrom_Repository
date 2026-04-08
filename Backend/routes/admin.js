import express from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Message from '../models/Message.js';
import { adminAuth } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

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

router.get('/profile', adminAuth, adminController.getProfile);

router.put('/profile', adminAuth, [
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
], adminController.updateProfile);

router.post('/profile/upload-avatar', adminAuth, upload.single('avatar'), adminController.uploadProfileAvatar);

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
