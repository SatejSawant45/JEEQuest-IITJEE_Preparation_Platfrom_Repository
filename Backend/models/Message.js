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
    enum: ['user', 'admin', 'mentor'],
  },
  messageType: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  content: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', messageSchema);
