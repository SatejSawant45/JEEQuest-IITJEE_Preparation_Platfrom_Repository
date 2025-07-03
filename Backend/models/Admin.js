import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: String,
    company: String,
    avatar: String, // URL to profile image
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    location: String,
    experience: String, // e.g. "5 years"

    // 👇 Authentication fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// 👇 Hash password before saving
adminSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


export default mongoose.model('Admin', adminSchema);
