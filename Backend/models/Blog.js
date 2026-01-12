import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10000
  },
  type: {
    type: String,
    enum: ['blog', 'question'],
    required: true,
    default: 'blog'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    type: String, // URLs to images
    trim: true
  }],
  video: {
    type: String, // URL to video
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  shares: {
    type: Number,
    default: 0
  },
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ type: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Blog', blogSchema);