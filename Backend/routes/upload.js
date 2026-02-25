import express from 'express';
import multer from 'multer';
import { uploadToS3, deleteFromS3 } from '../middlewares/s3Upload.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer with file size limit (5MB)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

/**
 * @route   POST /api/upload/quiz-image
 * @desc    Upload quiz question or option image to S3
 * @access  Protected (Admin only)
 */
router.post('/quiz-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get folder from request (default to 'quiz-images')
    const folder = req.body.folder || 'quiz-images';

    // Upload to S3
    const result = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

/**
 * @route   DELETE /api/upload/quiz-image
 * @desc    Delete quiz image from S3
 * @access  Protected (Admin only)
 */
router.delete('/quiz-image', adminAuth, async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ message: 'Image key is required' });
    }

    // Delete from S3
    await deleteFromS3(key);

    res.status(200).json({
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      message: 'Failed to delete image',
      error: error.message 
    });
  }
});

export default router;
