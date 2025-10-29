# Image Upload Solution for AI Creative Factory

## Answer: YES - Users can submit reference product images to Nano Banana!

Nano Banana has **two separate endpoints**:

1. **Text-to-Image** (`fal-ai/nano-banana`) - Generate images from text prompts only
2. **Image Editing** (`fal-ai/nano-banana/edit`) - Edit/transform existing images using text prompts + reference images

---

## How It Works

### Image Editing Endpoint

**Endpoint:** `fal-ai/nano-banana/edit`

**Key Parameters:**
- `prompt` (required) - Text description of what to generate/edit
- `image_urls` (required) - Array of reference image URLs
- `num_images` - Number of variations to generate (default: 1)
- `aspect_ratio` - Output aspect ratio (default: uses input image ratio)
- `output_format` - jpeg, png, or webp

**Example API Call:**
```javascript
const result = await fal.subscribe("fal-ai/nano-banana/edit", {
  input: {
    prompt: "Professional product shot with vibrant purple background and bold typography",
    image_urls: [
      "https://your-uploaded-image.jpg"
    ],
    num_images: 1,
    aspect_ratio: "1:1",
    output_format: "jpeg"
  }
});
```

---

## Implementation Strategy

### Option 1: Dual-Mode Generation (Recommended)

Allow users to choose between:
- **Text-only mode** - Uses text-to-image endpoint (current implementation)
- **Image reference mode** - Uses image editing endpoint with uploaded product photos

### Option 2: Always Use Image Editing Endpoint

If a reference image is provided, use the edit endpoint; otherwise fall back to text-to-image.

---

## Updated React Implementation

### 1. Update Product Store

**File:** `src/store/productStore.js`

```javascript
addProduct: (product) => set((state) => ({
  products: [...state.products, { 
    ...product, 
    id: Date.now(),
    createdAt: new Date().toISOString(),
    creativeAngles: [],
    images: [],
    referenceImages: [] // NEW: Store reference image URLs
  }]
})),
```

### 2. Update Fal.ai Service

**File:** `src/services/falService.js`

Add new function for image editing:

```javascript
/**
 * Generate image with reference images (image editing mode)
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
    const submitResponse = await fetch('https://queue.fal.run/fal-ai/nano-banana/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        image_urls: referenceImageUrls, // Array of image URLs
        num_images: numImages,
        aspect_ratio: aspectRatio,
        output_format: outputFormat
      })
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      throw new Error(`Fal.ai API error: ${submitResponse.status} - ${errorData.message || 'Unknown error'}`);
    }

    const submitData = await submitResponse.json();
    return await pollForResult(submitData.request_id);
  } catch (error) {
    console.error('Error generating image with reference:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Upload image file to Fal.ai storage
 */
export async function uploadImageToFal(file) {
  if (!FAL_API_KEY) {
    throw new Error('VITE_FAL_API_KEY is not set in environment variables');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://rest.alpha.fal.ai/storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.url; // Returns the hosted URL
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
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

### 3. Update Product Form Component

**File:** `src/components/ProductForm.jsx`

```javascript
import { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { uploadImageToFal } from '../services/falService';

export function ProductForm() {
  const addProduct = useProductStore(state => state.addProduct);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [referenceImages, setReferenceImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => uploadImageToFal(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setReferenceImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      alert(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!productName.trim() || !productDescription.trim()) {
      alert('Please fill in both product name and description');
      return;
    }

    addProduct({
      name: productName,
      description: productDescription,
      referenceImages: referenceImages
    });

    setProductName('');
    setProductDescription('');
    setReferenceImages([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Plus size={24} />
        Add New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Wireless Headphones"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Premium noise-cancelling headphones with 30-hour battery life"
          />
        </div>

        {/* NEW: Reference Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Images (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Upload product photos to use as reference. Nano Banana will transform them into professional ads.
          </p>
          
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload images'}
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
          {referenceImages.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {referenceImages.map((url, index) => (
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
        
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Product
        </button>
      </form>
    </div>
  );
}
```

### 4. Update Product Card Component

**File:** `src/components/ProductCard.jsx`

Update the `handleGenerateCreatives` function:

```javascript
const handleGenerateCreatives = async () => {
  setLoading(true);
  setProgress('Generating creative angles with Groq...');

  try {
    // Step 1: Generate 5 creative angles with Groq
    const angles = await generateCreativeAngles(
      product.name,
      product.description,
      5
    );
    
    updateProduct(product.id, { creativeAngles: angles });
    
    // Check if reference images exist
    const hasReferenceImages = product.referenceImages && product.referenceImages.length > 0;
    
    if (hasReferenceImages) {
      setProgress(`Generated ${angles.length} creative angles. Creating images with reference photos...`);
    } else {
      setProgress(`Generated ${angles.length} creative angles. Creating images...`);
    }

    // Step 2: Generate images with Fal.ai (with or without reference images)
    const imageResults = await generateMultipleImagesWithReference(
      angles,
      product.referenceImages || [], // Pass reference images if available
      {
        aspectRatio: '1:1',
        outputFormat: 'jpeg'
      }
    );

    // Step 3: Update product with successful results
    const successfulImages = imageResults
      .filter(result => result.success)
      .map((result, index) => ({
        angle: result.prompt,
        url: result.url,
        createdAt: new Date().toISOString()
      }));

    updateProduct(product.id, { 
      images: successfulImages,
      lastGenerated: new Date().toISOString()
    });

    setProgress('');
    alert(`Successfully generated ${successfulImages.length} images!`);
  } catch (error) {
    console.error('Error generating creatives:', error);
    alert(`Error: ${error.message}`);
    setProgress('');
  } finally {
    setLoading(false);
  }
};
```

Also add reference image display in the card:

```javascript
{/* Reference Images */}
{product.referenceImages && product.referenceImages.length > 0 && (
  <div className="mb-4">
    <h4 className="font-semibold text-gray-700 mb-2">Reference Images:</h4>
    <div className="grid grid-cols-4 gap-2">
      {product.referenceImages.map((url, index) => (
        <img 
          key={index}
          src={url} 
          alt={`Reference ${index + 1}`}
          className="w-full h-20 object-cover rounded border"
        />
      ))}
    </div>
  </div>
)}
```

---

## Updated Groq Prompts for Image Reference Mode

When reference images are provided, update the Groq prompt to mention them:

```javascript
const userPrompt = `Create ${numAngles} professional advertising concepts for this product. ${referenceImagesProvided ? 'Reference product images are provided - transform them into professional ad creatives.' : ''} Each concept should be a detailed, single-paragraph description for an AI image generator.

PRODUCT: ${productName}
DESCRIPTION: ${productDescription}
${referenceImagesProvided ? 'REFERENCE IMAGES: Product photos provided for transformation' : ''}

...rest of prompt...
`;
```

---

## Benefits of This Approach

✅ **Consistent Product Appearance** - Reference images ensure the actual product is used
✅ **Better Quality** - Nano Banana excels at transforming real photos into professional ads
✅ **Flexibility** - Users can choose text-only or image reference mode
✅ **Same Workflow** - Minimal changes to existing code structure
✅ **Cost Effective** - Same pricing ($0.039/image) for both modes

---

## Cost Comparison

| Mode | Cost per Product (5 images) |
|---|---|
| Text-only | $0.20 (Groq: $0.0005 + Fal: $0.195) |
| With reference images | $0.20 (same pricing) |

**No additional cost for using reference images!**

---

## Testing Workflow

1. Add product with name and description
2. Upload 1-3 reference product photos
3. Click "Generate Creative Images"
4. Groq generates 5 creative concepts
5. Fal.ai transforms reference images using those concepts
6. Result: 5 professional ad variations of your actual product

---

## Alternative: Base64 Upload

If you don't want to use Fal.ai's storage, you can convert images to base64:

```javascript
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Then pass base64 strings directly to image_urls
const base64Images = await Promise.all(files.map(fileToBase64));
```

**Note:** Base64 can impact performance for large files. Fal.ai storage is recommended.

---

## Summary

**Implementation Steps:**
1. Add `referenceImages` field to product store
2. Add `uploadImageToFal` and `generateImageWithReference` functions to falService
3. Update ProductForm with image upload UI
4. Update ProductCard to use reference images when available
5. Optionally update Groq prompts to mention reference images

**Result:** Users can now upload their actual product photos and Nano Banana will transform them into scroll-stopping professional advertisements using the engineered creative prompts!
