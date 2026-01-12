import express from 'express'; 
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { auth } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();


router.post('/register',authController.register);

router.post('/login',[
    body('email').isEmail(),
    body('password').notEmpty()
],authController.login);

// Profile routes
router.get('/profile', auth, authController.getProfile);

router.put('/profile', auth, [
    body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    body('location').optional().trim(),
    body('university').optional().trim(),
    body('course').optional().trim(),
    body('year').optional().trim(),
    body('gpa').optional().trim(),
    body('graduationYear').optional().trim(),
    body('about').optional().trim().isLength({ max: 500 }).withMessage('About section cannot exceed 500 characters'),
    body('skills').optional().isArray(),
    body('interests').optional().isArray(),
    body('profilePicture').optional().trim(),
    body('socialLinks.linkedin').optional().trim(),
    body('socialLinks.github').optional().trim(),
    body('socialLinks.portfolio').optional().trim()
], authController.updateProfile);

// Profile picture upload route
router.post('/profile/upload-picture', auth, upload.single('profilePicture'), authController.uploadProfilePicture);

export default router;