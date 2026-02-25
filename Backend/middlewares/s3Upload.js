import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload image to S3
 * @param {Buffer} fileBuffer - Image buffer
 * @param {string} originalName - Original filename
 * @param {string} mimetype - File MIME type
 * @param {string} folder - S3 folder (e.g., 'quiz-questions', 'quiz-options')
 * @returns {Promise<{url: string, key: string}>} S3 URL and key
 */
export const uploadToS3 = async (fileBuffer, originalName, mimetype, folder = 'quiz-images') => {
  try {
    // Generate unique filename
    const fileExtension = originalName.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    // Upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construct the public URL
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      url,
      key: fileName,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image to S3');
  }
};

/**
 * Delete image from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export const deleteFromS3 = async (key) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    console.log(`Successfully deleted ${key} from S3`);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete image from S3');
  }
};

export default {
  uploadToS3,
  deleteFromS3,
};
