import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Mentor from '../models/Mentor.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, "satejsawantsecret", { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, title, company } = req.body;

    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: "mentor already exists" });
    }

    const mentor = await Mentor.create({ name, email, password, title, company });
    const token = generateToken(mentor._id);

    res.status(201).json({
      id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      token,
      role: 'mentor',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, mentor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(mentor._id);
    res.status(200).json({
      id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      token,
      role: 'mentor',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentors', error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.mentor._id).select('-password');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(200).json(mentor);
  } catch (error) {
    console.error('Get mentor profile error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedFields = [
      'name',
      'title',
      'company',
      'location',
      'experience',
      'probableActiveTime',
      'description',
      'phone',
      'website',
      'linkedin',
      'github',
      'avatar',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.mentor._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      mentor: updatedMentor,
    });
  } catch (error) {
    console.error('Update mentor profile error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
