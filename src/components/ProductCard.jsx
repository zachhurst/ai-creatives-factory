import { useState } from 'react';
import { Trash2, Download, Wand2, Eye } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { generateCreativeAngles } from '../services/groqService';
import { generateMultipleImagesWithReference } from '../services/falService';
import { downloadImage, formatDate, hasReferenceImages, getGenerationMode } from '../utils/helpers';
import { useDialog } from './ui/DialogProvider';
import { ImagePreview } from './ImagePreview';
import { GenerationProgress } from './GenerationProgress';
import { ImageGenerationProgress, ImageGenerationStatus } from '../utils/imageGeneration';

export function ProductCard({ product }) {
  const { updateProduct, deleteProduct } = useProductStore();
  const { showAlert, showConfirm, showSuccess } = useDialog();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);

  const handleGenerateCreatives = async () => {
    setLoading(true);

    try {
      // Check if reference images exist
      const hasRefs = hasReferenceImages(product);
      
      // Step 1: Generate creative angles with Groq
      const angles = await generateCreativeAngles(
        product.name,
        product.description,
        5,
        hasRefs
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
      const imageResults = await generateMultipleImagesWithReference(
        angles,
        product.referenceImages || [],
        {
          aspectRatio: '1:1',
          outputFormat: 'jpeg'
        },
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
      const modeText = hasRefs ? 'using reference images' : 'from text';
      showSuccess(`Successfully generated ${successfulImages.length} images ${modeText}!`);
    } catch (error) {
      console.error('Error generating creatives:', error);
      showAlert(`Error: ${error.message}`);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async (url, index) => {
    try {
      const filename = `${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-creative-${index + 1}.jpg`;
      await downloadImage(url, filename);
    } catch (error) {
      showAlert('Failed to download image');
    }
  };

  const handleDeleteProduct = async () => {
    const confirmed = await showConfirm('Delete this product and all its data? This cannot be undone.');
    if (confirmed) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">{formatDate(product.createdAt)}</p>
        </div>
        <button
          onClick={handleDeleteProduct}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Delete product"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{product.description}</p>

      {/* Reference Images */}
      <ImagePreview
        images={product.referenceImages || []}
        title="Reference Images"
        className="mb-4"
      />

      {/* Generation Mode Indicator */}
      {hasReferenceImages(product) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-700 font-medium">
              {getGenerationMode(product)} - {product.referenceImages?.length} reference image{product.referenceImages?.length !== 1 ? 's' : ''} will be used
            </span>
          </div>
        </div>
      )}

      {/* Real-time Progress Display */}
      {progress && (
        <GenerationProgress 
          progress={progress}
          onCancel={() => setProgress(null)}
        />
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateCreatives}
        disabled={loading}
        className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 mb-4"
      >
        <Wand2 size={18} />
        {loading ? 'Generating...' : 'Generate Creative Images'}
      </button>

      {/* Creative Angles */}
      {product.creativeAngles && product.creativeAngles.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Creative Angles:</h4>
          <div className="space-y-2">
            {product.creativeAngles.map((angle, index) => (
              <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Angle {index + 1}:</span> {angle}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Images */}
      {product.images && product.images.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Generated Images:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {product.images.map((img, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={img.url}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleDownloadImage(img.url, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    title="Download image"
                  >
                    <Download size={16} />
                  </button>
                </div>
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          {product.lastGenerated && (
            <p className="text-xs text-gray-500 mt-2">
              Last generated: {formatDate(product.lastGenerated)}
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {!product.images || product.images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Eye size={48} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No images generated yet</p>
          <p className="text-xs mt-1">Click "Generate Creative Images" to get started</p>
        </div>
      ) : null}
    </div>
  );
}