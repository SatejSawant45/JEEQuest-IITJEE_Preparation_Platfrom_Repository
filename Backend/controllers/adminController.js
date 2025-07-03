import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, "satejsawantsecret", { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, title, company } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "admin already exists" });

    const admin = await Admin.create({ name, email, password, title, company });

    const token = generateToken(admin._id);
    res.status(201).json({ id: admin._id, name: admin.name, email: admin.email, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    console.log('hello')
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    console.log(admin)
    if (!admin || !bcrypt.compare(admin.password,password))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);
    res.status(200).json({ id: admin._id, name: admin.name, email: admin.email, token });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const admin = await Admin.find({});
    console.log(admin);
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admins', error });
  }
};
