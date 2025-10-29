/**
 * Fal.ai API Service
 * Model: fal-ai/nano-banana | Cost: $0.039/image | Time: 3-5 seconds
 */

import { fal } from '@fal-ai/client';

const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;

// Configure Fal.ai client
if (FAL_API_KEY) {
  fal.config({
    credentials: FAL_API_KEY
  });
}

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

async function pollForResult(requestId, maxAttempts = 60) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const statusResponse = await fetch(
        `${FAL_API_URL}/requests/${requestId}`,
        { headers: { 'Authorization': `Key ${FAL_API_KEY}` } }
      );

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();

      if (statusData.status === 'COMPLETED') {
        return {
          url: statusData.images[0].url,
          description: statusData.description || ''
        };
      }

      if (statusData.status === 'FAILED') {
        throw new Error('Image generation failed');
      }
      
      attempts++;
    } catch (error) {
      console.error('Polling error:', error);
      attempts++;
    }
  }

  throw new Error('Image generation timed out after 60 seconds');
}

export async function generateMultipleImages(prompts, options = {}) {
  const results = [];
  
  for (const prompt of prompts) {
    try {
      const result = await generateImage(prompt, options);
      results.push({ prompt, url: result.url, success: true });
    } catch (error) {
      results.push({ prompt, error: error.message, success: false });
    }
  }
  
  return results;
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
 * Generate multiple images with optional reference images
 * Automatically chooses appropriate endpoint based on reference images
 */
export async function generateMultipleImagesWithReference(
  prompts, 
  referenceImageUrls = [], 
  options = {},
  onProgress = null  // ← NEW: Progress callback
) {
  // Create all generation promises in parallel
  const imagePromises = prompts.map(async (prompt, index) => {
    try {
      // Notify start of generation
      onProgress?.(index, 'generating', null);
      
      let result;
      if (referenceImageUrls.length > 0) {
        result = await generateImageWithReference(prompt, referenceImageUrls, options);
      } else {
        result = await generateImage(prompt, options);
      }
      
      // Notify successful completion
      onProgress?.(index, 'success', result.url);
      
      return { 
        prompt, 
        url: result.url, 
        success: true,
        index  // ← NEW: Track original order
      };
    } catch (error) {
      // Notify error
      onProgress?.(index, 'error', error.message);
      
      return { 
        prompt, 
        error: error.message, 
        success: false,
        index  // ← NEW: Track original order
      };
    }
  });

  // Execute all promises in parallel
  const results = await Promise.all(imagePromises);
  
  // Sort by original index to maintain order
  return results.sort((a, b) => a.index - b.index);
}

/**
 * Test image upload functionality
 */
export async function testImageUpload() {
  try {
    // Create a test image blob
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 100, 100);
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
    const uploadedUrl = await uploadImageToFal(file);
    
    return { success: true, url: uploadedUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testFalConnection() {
  try {
    const result = await generateImage('A simple test image of a red apple', { aspectRatio: '1:1' });
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}