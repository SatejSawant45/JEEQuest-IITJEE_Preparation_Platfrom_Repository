import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

/**
 * ImageUpload Component
 * Handles image upload to S3 via backend API
 * 
 * @param {string} label - Label for the upload button
 * @param {object} currentImage - Current image object {url, key, alt}
 * @param {function} onImageUpload - Callback when image is uploaded
 * @param {function} onImageRemove - Callback when image is removed
 * @param {string} folder - S3 folder name (optional)
 */
const ImageUpload = ({ 
  label = "Add Image", 
  currentImage = null, 
  onImageUpload, 
  onImageRemove,
  folder = "quiz-images"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${primaryBackendUrl}/api/upload/quiz-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      console.log("✅ Image uploaded successfully:", data);
      
      // Call the callback with the uploaded image data
      const imageData = {
        url: data.url,
        key: data.key,
        alt: file.name,
      };
      
      console.log("📸 Calling onImageUpload with:", imageData);
      onImageUpload(imageData);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    }
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {currentImage ? (
        <div className="relative border rounded-lg p-3 bg-gray-50">
          <div className="flex items-start gap-3">
            <img 
              src={currentImage.url} 
              alt={currentImage.alt || 'Uploaded image'} 
              className="w-32 h-32 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Image uploaded</p>
              <p className="text-xs text-gray-500 mt-1 break-all">{currentImage.url.split('/').pop()}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id={`image-upload-${Math.random()}`}
          />
          <label htmlFor={`image-upload-${Math.random()}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {label}
                </>
              )}
            </Button>
          </label>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      
      {!currentImage && !error && (
        <p className="text-xs text-gray-500">
          Max size: 5MB. Formats: JPEG, PNG, GIF, WebP
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
