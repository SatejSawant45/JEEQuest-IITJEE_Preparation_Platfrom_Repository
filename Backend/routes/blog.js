import express from 'express';
import { body } from 'express-validator';
import * as blogController from '../controllers/blogController.js';
import { adminOrMentorAuth, auth } from '../middlewares/auth.js';
import blogUpload from '../middlewares/blogUpload.js';

const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/user/my-blogs', adminOrMentorAuth, blogController.getUserBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes (require authentication)
router.post('/', adminOrMentorAuth, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Content is required and must be less than 10000 characters'),
  body('type').optional().isIn(['blog', 'question']).withMessage('Type must be either blog or question'),
  body('tags').optional().isString(),
  body('image').optional().trim(),
  body('video').optional().trim()
], blogController.createBlog);

router.put('/:id', adminOrMentorAuth, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content').optional().trim().isLength({ min: 1, max: 10000 }).withMessage('Content must be less than 10000 characters'),
  body('type').optional().isIn(['blog', 'question']).withMessage('Type must be either blog or question'),
  body('tags').optional().isString(),
  body('image').optional().trim(),
  body('video').optional().trim()
], blogController.updateBlog);

router.delete('/:id', adminOrMentorAuth, blogController.deleteBlog);

router.post('/:id/like', auth, blogController.toggleLikeBlog);

router.post('/:id/comment', auth, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment content is required and must be less than 1000 characters')
], blogController.addComment);

router.post('/:id/bookmark', auth, blogController.toggleBookmark);

// Blog image upload routes
router.post('/upload-images', adminOrMentorAuth, blogUpload.array('images', 5), blogController.uploadBlogImages);

export default router;