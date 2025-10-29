/**
 * Utility functions for AI Creative Factory
 */

export function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || `ai-creative-${Date.now()}.jpg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
}

export function calculateEstimatedCost(numProducts, numAnglesPerProduct = 5) {
  const GROQ_COST_PER_PRODUCT = 0.0005; // $0.0005 per Groq request
  const FAL_COST_PER_IMAGE = 0.039; // $0.039 per image
  
  const totalGroqCost = numProducts * GROQ_COST_PER_PRODUCT;
  const totalImages = numProducts * numAnglesPerProduct;
  const totalFalCost = totalImages * FAL_COST_PER_IMAGE;
  
  return {
    totalCost: totalGroqCost + totalFalCost,
    groqCost: totalGroqCost,
    falCost: totalFalCost,
    totalImages,
    costPerProduct: GROQ_COST_PER_PRODUCT + (numAnglesPerProduct * FAL_COST_PER_IMAGE)
  };
}

/**
 * Validate uploaded image files
 */
export function validateImageFiles(files) {
  const errors = [];
  const maxSize = 10 * 1024 * 1024; // 10MB per file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFiles = 5;

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} images allowed`);
  }

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: ${file.name} is not a supported image type`);
    }
    
    if (file.size > maxSize) {
      errors.push(`File ${index + 1}: ${file.name} is too large (max 10MB)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate image preview URL (for local display before upload)
 */
export function generateLocalImageUrl(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke local image URL to prevent memory leaks
 */
export function revokeLocalImageUrl(url) {
  URL.revokeObjectURL(url);
}

/**
 * Check if product has reference images
 */
export function hasReferenceImages(product) {
  return product.referenceImages && product.referenceImages.length > 0;
}

/**
 * Get generation mode description
 */
export function getGenerationMode(product) {
  return hasReferenceImages(product) ? 'Image Reference Mode' : 'Text-Only Mode';
}

/**
 * Validate API keys are present
 */
export function validateApiKeys() {
  const errors = [];
  
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    errors.push('VITE_GROQ_API_KEY is missing');
  }
  
  if (!import.meta.env.VITE_FAL_API_KEY) {
    errors.push('VITE_FAL_API_KEY is missing');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

/**
 * Check if file is an image
 */
export function isImageFile(file) {
  return file.type.startsWith('image/');
}

/**
 * Create a safe filename for download
 */
export function createSafeFilename(productName, index) {
  const safeName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${safeName}-creative-${index + 1}.jpg`;
}