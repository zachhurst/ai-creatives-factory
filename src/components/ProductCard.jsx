import { useState, useCallback } from 'react';
import { Trash2, Download, Wand2, Eye, Sparkles, AlertTriangle } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { generateCreativeAngles } from '../services/groqService';
import { generateMultipleImagesWithReference } from '../services/falService';
import { downloadImage, formatDate, hasReferenceImages, getGenerationMode } from '../utils/helpers';
import { ImagePreview } from './ImagePreview';
import { ImageGenerationProgress } from '../utils/imageGeneration';
import { GenerationProgress } from './GenerationProgress';
import { IncrementalImageDisplay } from './IncrementalImageDisplay';
import { GenerationErrorRecovery } from './GenerationErrorRecovery';

export function ProductCard({ product }) {
  const { updateProduct, deleteProduct } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [generationId, setGenerationId] = useState(null);

  const handleGenerateCreatives = useCallback(async () => {
    if (loading || !product.description) return;
    setLoading(true);
    const currentGenerationId = Date.now().toString();
    setGenerationId(currentGenerationId);

    try {
      // Generate angles
      setProgress('Generating creative angles...');
      const { generateCreativeAngles } = await import('../services/groqService');
      const anglesData = await generateCreativeAngles(product.description, product.name);
      const angles = anglesData.angles;
      if (!angles || angles.length === 0) throw new Error('No creative angles generated');

      // Create progress tracker
      const imageProgress = new ImageGenerationProgress(angles.length);
      setProgress(imageProgress);

      // Progress callback
      const onImageProgress = (index, status, data) => {
        if (generationId !== currentGenerationId) return;
        imageProgress.updateImage(index, status, { prompt: angles[index], url: data, error: data });
        setProgress({ ...imageProgress });
      };

      // Generate in parallel
      const imageResults = await generateMultipleImagesWithReference(
        angles,
        product.referenceImages || [],
        { aspectRatio: '1:1', outputFormat: 'jpeg' },
        onImageProgress
      );

      if (generationId !== currentGenerationId) return;

      // Update product
      const successfulImages = imageResults
        .filter(r => r.success)
        .map(r => ({ angle: r.prompt, url: r.url, createdAt: new Date().toISOString() }));

      updateProduct(product.id, { images: successfulImages, lastGenerated: new Date().toISOString() });

      setProgress(`✅ Generated ${successfulImages.length} images!`);
      setTimeout(() => { if (generationId === currentGenerationId) setProgress(null); }, 3000);

    } catch (error) {
      setProgress(`❌ Error: ${error.message}`);
      setTimeout(() => { if (generationId === currentGenerationId) setProgress(null); }, 5000);
    } finally {
      setLoading(false);
    }
  }, [product, loading, generationId, updateProduct]);

  const handleDownloadImage = useCallback(async (url, index) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${product.name}-creative-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
    }
  }, [product.name]);

  const handleCancelGeneration = useCallback(() => {
    setGenerationId(null);
    setProgress(null);
    setLoading(false);
  }, []);

  const handleRetryFailed = useCallback(async (failedPrompts) => {
    if (!progress || failedPrompts.length === 0) return;
    // Retry logic here - similar to initial generation but for failed items
  }, [progress, product, updateProduct]);

  const handleRemoveFailed = useCallback((failedIndexes) => {
    if (!product.images) return;
    const filteredImages = product.images.filter((_, index) => !failedIndexes.includes(index));
    updateProduct(product.id, { images: filteredImages });
    setProgress(null);
  }, [product.images, updateProduct]);

  const handleDeleteProduct = () => {
    if (confirm('Delete this product and all its data? This cannot be undone.')) {
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

      {/* Progress Components */}
      {progress && typeof progress === 'object' && (
        <>
          <GenerationProgress progress={progress} onCancel={handleCancelGeneration} />
          <GenerationErrorRecovery progress={progress} onRetryFailed={handleRetryFailed} onRemoveFailed={handleRemoveFailed} />
          {progress.images.some(img => img.status === 'success') && (
            <IncrementalImageDisplay progress={progress} onDownloadImage={handleDownloadImage} />
          )}
        </>
      )}

      {progress && typeof progress === 'string' && (
        <div className={`p-3 rounded-lg mb-4 ${
          progress.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
          progress.includes('❌') ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {progress.includes('✅') && <div className="text-green-600">✓</div>}
            {progress.includes('❌') && <AlertTriangle size={16} className="text-red-600" />}
            <span className="text-sm font-medium">{progress}</span>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateCreatives}
        disabled={loading || !product.description}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 mb-4"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>
        ) : (
          <><Sparkles size={18} />Generate Creative Images</>
        )}
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
      {product.images && product.images.length > 0 && !progress && (
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