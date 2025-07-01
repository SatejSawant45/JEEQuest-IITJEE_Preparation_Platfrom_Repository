// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  senderRole: {
    type: String,
    enum: ['user', 'admin'],
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', messageSchema);
