import Blog from '../models/Blog.js';
import { validationResult } from 'express-validator';

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, type, tags, image, video } = req.body;

    // Process tags - convert comma-separated string to array and clean up
    const processedTags = tags 
      ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
      : [];

    const blog = await Blog.create({
      title,
      content,
      type: type || 'blog',
      author: req.user._id,
      tags: processedTags,
      images: req.body.images || [],
      video: video || null
    });

    // Populate author information including profile picture
    await blog.populate('author', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all blogs (public view)
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type; // 'blog' or 'question'
    const tags = req.query.tags; // comma-separated tags
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Build query
    const query = { isPublished: true };

    if (type) {
      query.type = type;
    }

    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagsArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email profilePicture')
      .populate('comments.author', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get user's own blogs
export const getUserBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: req.user._id })
      .populate('author', 'name email profilePicture')
      .populate('comments.author', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ author: req.user._id });

    res.json({
      success: true,
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('comments.author', 'name email profilePicture');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update blog (only by author)
export const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const { title, content, type, tags, image, video } = req.body;

    // Process tags
    const processedTags = tags 
      ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
      : blog.tags;

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (type) blog.type = type;
    blog.tags = processedTags;
    if (image !== undefined) blog.image = image;
    if (video !== undefined) blog.video = video;

    await blog.save();
    await blog.populate('author', 'name email profilePicture');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete blog (only by author)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Like/Unlike blog
export const toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userId = req.user._id;
    const hasLiked = blog.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      blog.likedBy.pull(userId);
      blog.likes = Math.max(0, blog.likes - 1);
    } else {
      // Like
      blog.likedBy.push(userId);
      blog.likes += 1;
    }

    await blog.save();

    res.json({
      success: true,
      liked: !hasLiked,
      likes: blog.likes
    });
  } catch (error) {
    console.error('Toggle like blog error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add comment to blog
export const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = {
      author: req.user._id,
      content
    };

    blog.comments.push(newComment);
    await blog.save();

    // Populate the new comment with author info
    await blog.populate('comments.author', 'name email profilePicture');
    
    const addedComment = blog.comments[blog.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: addedComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userId = req.user._id;
    const hasBookmarked = blog.bookmarkedBy.includes(userId);

    if (hasBookmarked) {
      blog.bookmarkedBy.pull(userId);
    } else {
      blog.bookmarkedBy.push(userId);
    }

    await blog.save();

    res.json({
      success: true,
      bookmarked: !hasBookmarked
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Upload blog images
export const uploadBlogImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map(file => `/uploads/blogs/${file.filename}`);

    res.json({
      success: true,
      message: "Images uploaded successfully",
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload blog images error:', error);
    res.status(500).json({ message: "Server Error" });
  }
};