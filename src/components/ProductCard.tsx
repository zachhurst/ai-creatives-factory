import { useState } from 'react';
import { Trash2, Sparkles, Download, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { generateCreativeAngles } from '../services/groqService';
import { generateMultipleImages } from '../services/falService';
import { downloadImage, formatDate } from '../utils/helpers';

export function ProductCard({ product }) {
  const { updateProduct, deleteProduct } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

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
      setProgress(`Generated ${angles.length} creative angles. Creating images with Fal.ai...`);

      // Step 2: Generate images with Fal.ai (square format for social media)
      const imageResults = await generateMultipleImages(angles, {
        aspectRatio: '1:1',
        outputFormat: 'jpeg'
      });

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

  const handleDelete = () => {
    if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteProduct(product.id);
    }
  };

  const handleDownloadImage = async (url, index) => {
    const filename = `${product.name.replace(/\s+/g, '_')}_image_${index + 1}.jpg`;
    try {
      await downloadImage(url, filename);
    } catch (error) {
      alert('Failed to download image');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Created {formatDate(product.createdAt)}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Delete product"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">{product.description}</p>

      {/* Generate Button */}
      <button
        onClick={handleGenerateCreatives}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Creative Images
          </>
        )}
      </button>

      {/* Progress */}
      {progress && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">{progress}</p>
        </div>
      )}

      {/* Creative Angles */}
      {product.creativeAngles && product.creativeAngles.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Creative Angles:</h4>
          <ul className="space-y-1">
            {product.creativeAngles.map((angle, index) => (
              <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-300">
                {angle.substring(0, 150)}{angle.length > 150 ? '...' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generated Images */}
      {product.images && product.images.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Generated Images:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {product.images.map((img, index) => (
              <div key={index} className="border rounded-lg overflow-hidden group relative">
                <img 
                  src={img.url} 
                  alt={`Creative ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <p className="text-xs text-gray-600 line-clamp-2">{img.angle.substring(0, 80)}...</p>
                </div>
                <button
                  onClick={() => handleDownloadImage(img.url, index)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Download image"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
