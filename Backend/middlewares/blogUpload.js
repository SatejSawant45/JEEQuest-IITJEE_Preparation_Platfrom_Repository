import multer from 'multer';

// Use memory storage for S3 uploads
// Files will be temporarily stored in memory as Buffer objects
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer for blog images
const blogUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for blog images
    },
    fileFilter: fileFilter
});

export default blogUpload;