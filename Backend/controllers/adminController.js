import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import { uploadToS3, deleteFromS3 } from '../middlewares/s3Upload.js';

const generateToken = (id) => {
  return jwt.sign({ id }, "satejsawantsecret", { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, title, company, secretKey } = req.body;

    // Check if the provided secret key matches the environment variable
    const adminSecret = process.env.ADMIN_SECRET_KEY || "my_super_secret_admin_key";
    if (secretKey !== adminSecret) {
      return res.status(403).json({ message: "Invalid Admin Secret Key. You are not authorized to create an admin account." });
    }

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
    console.log('🔐 Admin login attempt')
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    console.log('📧 Email:', email)
    console.log('🔑 Password received (length):', password ? password.length : 0)

    const admin = await Admin.findOne({ email });
    console.log('👤 Admin found:', admin ? admin.name : 'Not found')
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('💾 Stored password hash (first 30 chars):', admin.password.substring(0, 30))
    console.log('🔐 Comparing:', password, 'with hash...')
    
    // ✅ Fix: Add await to bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log('✅ Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);
    console.log('🎉 Login successful, token generated')
    res.status(200).json({ id: admin._id, name: admin.name, email: admin.email, token });

  } catch (err) {
    console.log('❌ Login error:', err)
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

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
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

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const uploadProfileAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.avatar) {
      try {
        const s3UrlPattern = /amazonaws\.com\/(.+)$/;
        const match = admin.avatar.match(s3UrlPattern);
        if (match && match[1]) {
          await deleteFromS3(match[1]);
        }
      } catch (deleteError) {
        console.error('Error deleting old admin avatar from S3:', deleteError);
      }
    }

    const { url } = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'admin-avatars'
    );

    admin.avatar = url;
    await admin.save();

    const safeAdmin = await Admin.findById(adminId).select('-password');

    res.status(200).json({
      message: 'Admin avatar uploaded successfully',
      avatar: url,
      admin: safeAdmin,
    });
  } catch (error) {
    console.error('Upload admin avatar error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
