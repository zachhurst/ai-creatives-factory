import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { ImageUploadZone } from './ImageUploadZone';

export function ProductForm() {
  const addProduct = useProductStore(state => state.addProduct);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [referenceImages, setReferenceImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName.trim() || !productDescription.trim()) {
      alert('Please fill in both product name and description');
      return;
    }

    // Note: ImageUploadZone handles upload validation internally

    setIsSubmitting(true);

    try {
      addProduct({
        name: productName.trim(),
        description: productDescription.trim(),
        referenceImages: referenceImages
      });

      // Reset form
      setProductName('');
      setProductDescription('');
      setReferenceImages([]);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesUploaded = (urls) => {
    // Store URLs directly (ImageUploadZone returns URLs, not objects)
    setReferenceImages(urls);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Plus size={24} />
        Add New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
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
            disabled={isSubmitting}
          />
        </div>
        
        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Premium noise-cancelling headphones with 30-hour battery life and studio-quality sound"
            disabled={isSubmitting}
          />
        </div>

        {/* Reference Images Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Reference Images (Optional)
            </label>
            {referenceImages.length > 0 && (
              <span className="text-xs text-gray-500">
                {referenceImages.length} image{referenceImages.length !== 1 ? 's' : ''} uploaded
              </span>
            )}
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500">
              Upload product photos to use as reference. Nano Banana will transform them into professional ads while maintaining the product's appearance.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              💡 Tip: Images help maintain product consistency in generated ads
            </p>
          </div>
          
          <ImageUploadZone
            onImagesUploaded={handleImagesUploaded}
            maxFiles={3}
            disabled={isSubmitting}
            className="mt-2"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !productName.trim() || !productDescription.trim()}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>

        {/* Form Status */}
        {referenceImages.length > 0 && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            ✓ {referenceImages.length} reference image{referenceImages.length !== 1 ? 's' : ''} ready
            {referenceImages.length > 0 && ' - Will be used for image generation'}
          </div>
        )}
      </form>
    </div>
  );
}