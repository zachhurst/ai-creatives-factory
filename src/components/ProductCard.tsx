import { useState } from 'react';
import { Trash2, Sparkles, Download, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { generateCreativeAngles } from '../services/groqService';
import { generateMultipleImages } from '../services/falService';
import { downloadImage, formatDate } from '../utils/helpers';
import { GenerationProgress } from './GenerationProgress';
import { ImageGenerationProgress, ImageGenerationStatus } from '../utils/imageGeneration';
import { useDialog } from './ui/DialogProvider';

export function ProductCard({ product }) {
  const { updateProduct, deleteProduct } = useProductStore();
  const { showAlert, showConfirm, showSuccess } = useDialog();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);

  const handleGenerateCreatives = async () => {
    setLoading(true);

    try {
      // Step 1: Generate creative angles with Groq
      const angles = await generateCreativeAngles(
        product.name,
        product.description,
        5
      );
      
      updateProduct(product.id, { creativeAngles: angles });

      // Step 2: Initialize progress tracker
      const progressTracker = new ImageGenerationProgress(angles.length);
      setProgress(progressTracker);

      // Step 3: Progress callback - updates UI in real-time
      const handleProgress = (index, status, data) => {
        progressTracker.updateImage(index, status, data);
        // Force re-render with counter - keeps class methods intact
        setUpdateCounter(c => c + 1);
      };

      // Step 4: Generate images in PARALLEL with progress callbacks
      const imageResults = await generateMultipleImages(
        angles,
        { aspectRatio: '1:1', outputFormat: 'jpeg' },
        handleProgress  // Pass callback for real-time updates
      );

      // Step 5: Update product with successful results
      const successfulImages = imageResults
        .filter(result => result.success)
        .map((result) => ({
          angle: result.prompt,
          url: result.url,
          createdAt: new Date().toISOString()
        }));

      updateProduct(product.id, { 
        images: successfulImages,
        lastGenerated: new Date().toISOString()
      });

      setProgress(null);  // Clear progress on completion
      showSuccess(`Successfully generated ${successfulImages.length} images!`);
    } catch (error) {
      console.error('Error generating creatives:', error);
      showAlert(`Error: ${error.message}`);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm(`Delete "${product.name}"? This cannot be undone.`);
    if (confirmed) {
      deleteProduct(product.id);
    }
  };

  const handleDownloadImage = async (url, index) => {
    const filename = `${product.name.replace(/\s+/g, '_')}_image_${index + 1}.jpg`;
    try {
      await downloadImage(url, filename);
    } catch (error) {
      showAlert('Failed to download image');
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

      {/* Real-time Progress Display */}
      {progress && (
        <GenerationProgress 
          progress={progress}
          onCancel={() => setProgress(null)}
        />
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
