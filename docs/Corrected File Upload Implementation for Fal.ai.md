# Corrected File Upload Implementation for Fal.ai

## The Problem

The error `Failed to upload image: Upload failed: 404` occurred because the code was using:
```
https://rest.alpha.fal.ai/storage/upload
```

This endpoint doesn't exist or requires a different authentication method.

## The Solution

**Use the Fal.ai JavaScript client library's built-in `fal.storage.upload()` method instead of making raw HTTP requests.**

---

## Updated Implementation

### 1. Install Fal.ai Client (if not already installed)

```bash
npm install @fal-ai/client
```

### 2. Updated `falService.js`

**File:** `src/services/falService.js`

Replace the `uploadImageToFal` function with this corrected version:

```javascript
import { fal } from '@fal-ai/client';

// Configure Fal.ai client
const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;

if (FAL_API_KEY) {
  fal.config({
    credentials: FAL_API_KEY
  });
}

/**
 * Upload image file to Fal.ai storage (CORRECTED VERSION)
 * Uses the official @fal-ai/client library instead of raw HTTP
 */
export async function uploadImageToFal(file) {
  if (!FAL_API_KEY) {
    throw new Error('VITE_FAL_API_KEY is not set in environment variables');
  }

  try {
    // Use the official fal.storage.upload() method
    const url = await fal.storage.upload(file);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Generate image with reference images (image editing mode)
 * Uses fal.subscribe instead of raw HTTP
 */
export async function generateImageWithReference(prompt, referenceImageUrls, options = {}) {
  if (!FAL_API_KEY) {
    throw new Error('VITE_FAL_API_KEY is not set in environment variables');
  }

  const {
    aspectRatio = '1:1',
    outputFormat = 'jpeg',
    numImages = 1
  } = options;

  try {
    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: {
        prompt: prompt,
        image_urls: referenceImageUrls,
        num_images: numImages,
        aspect_ratio: aspectRatio,
        output_format: outputFormat
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Generation in progress...');
        }
      }
    });

    // Return the first image URL
    if (result.data && result.data.images && result.data.images.length > 0) {
      return {
        url: result.data.images[0].url,
        description: result.data.description
      };
    } else {
      throw new Error('No images returned from Fal.ai');
    }
  } catch (error) {
    console.error('Error generating image with reference:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Generate image from text only (text-to-image mode)
 * Uses fal.subscribe instead of raw HTTP
 */
export async function generateImage(prompt, options = {}) {
  if (!FAL_API_KEY) {
    throw new Error('VITE_FAL_API_KEY is not set in environment variables');
  }

  const {
    aspectRatio = '1:1',
    outputFormat = 'jpeg',
    numImages = 1
  } = options;

  try {
    const result = await fal.subscribe('fal-ai/nano-banana', {
      input: {
        prompt: prompt,
        num_images: numImages,
        aspect_ratio: aspectRatio,
        output_format: outputFormat
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Generation in progress...');
        }
      }
    });

    if (result.data && result.data.images && result.data.images.length > 0) {
      return {
        url: result.data.images[0].url,
        description: result.data.description
      };
    } else {
      throw new Error('No images returned from Fal.ai');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Generate multiple images with optional reference images
 */
export async function generateMultipleImagesWithReference(prompts, referenceImageUrls = [], options = {}) {
  const results = [];
  
  for (const prompt of prompts) {
    try {
      let result;
      
      if (referenceImageUrls.length > 0) {
        // Use image editing endpoint with reference images
        result = await generateImageWithReference(prompt, referenceImageUrls, options);
      } else {
        // Use text-to-image endpoint (original behavior)
        result = await generateImage(prompt, options);
      }
      
      results.push({ 
        prompt, 
        url: result.url, 
        success: true 
      });
    } catch (error) {
      results.push({ 
        prompt, 
        error: error.message, 
        success: false 
      });
    }
  }
  
  return results;
}
```

---

## Key Changes

### ❌ Old (Broken) Approach
```javascript
// DON'T DO THIS - This endpoint doesn't work
const response = await fetch('https://rest.alpha.fal.ai/storage/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Key ${FAL_API_KEY}`
  },
  body: formData
});
```

### ✅ New (Working) Approach
```javascript
// DO THIS - Use the official client library
import { fal } from '@fal-ai/client';

fal.config({
  credentials: FAL_API_KEY
});

const url = await fal.storage.upload(file);
```

---

## Why This Works

1. **Official Client Library** - `@fal-ai/client` handles all the internal API endpoints correctly
2. **Auto-Configuration** - The library knows the correct upload endpoint
3. **Error Handling** - Better error messages from the official client
4. **Future-Proof** - If Fal.ai changes their API, the client library will be updated

---

## Complete Working Example

**File:** `src/components/ImageUploadZone.jsx`

```javascript
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImageToFal } from '../services/falService';

export function ImageUploadZone({ onImagesUploaded, existingImages = [] }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(existingImages);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      // Upload all files in parallel using the corrected function
      const uploadPromises = files.map(file => uploadImageToFal(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...uploadedImages, ...uploadedUrls];
      setUploadedImages(newImages);
      onImagesUploaded(newImages);
      
      alert(`Successfully uploaded ${uploadedUrls.length} images!`);
    } catch (error) {
      alert(`Failed to upload images: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div>
      <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload reference images'}
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* Image Preview */}
      {uploadedImages.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative group">
              <img 
                src={url} 
                alt={`Reference ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Testing

1. Make sure `@fal-ai/client` is installed:
   ```bash
   npm install @fal-ai/client
   ```

2. Verify your `.env` file has the API key:
   ```
   VITE_FAL_API_KEY=your_actual_key_here
   ```

3. Test the upload:
   - Select a product image
   - Click upload
   - Should see "Successfully uploaded X images!"
   - No 404 errors in console

---

## Summary

**Problem:** Using wrong endpoint `https://rest.alpha.fal.ai/storage/upload`

**Solution:** Use `fal.storage.upload(file)` from `@fal-ai/client` library

**Result:** File uploads work correctly, returning valid URLs that can be used with the image editing endpoint

The official client library handles all the complexity internally, including:
- Correct endpoint URLs
- Proper authentication
- Error handling
- File format conversion
- URL generation

This is the recommended approach from Fal.ai's own documentation! 🎯
