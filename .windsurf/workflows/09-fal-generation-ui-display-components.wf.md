# AI Creative Factory - Fal.ai Generation UI Improvements
## WORKFLOW PHASE 9B: Incremental Display Components (Part 2B of 3)

Create components to display images as they complete, not after all 5 finish.

---

## Tasks

### TASK 9B.1: Create Incremental Image Display

**File:** `src/components/IncrementalImageDisplay.jsx` (NEW FILE)

```javascript
import { useState } from 'react';
import { Download, Eye, RotateCcw } from 'lucide-react';

export function IncrementalImageDisplay({ progress, onImageClick = null, onDownloadImage = null, onRegenerateImage = null }) {
  const [selectedImage, setSelectedImage] = useState(null);
  if (!progress) return null;

  const completedImages = progress.images.filter(img => img.status === 'success' && img.url);

  const handleImageClick = (image, index) => {
    setSelectedImage({ image, index });
    onImageClick?.(image.url, index);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-700">
          Generated Images ({completedImages.length}/{progress.totalImages})
        </h4>
        {completedImages.length > 0 && <div className="text-sm text-gray-500">Click to view full size</div>}
      </div>

      {completedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {completedImages.map((image, originalIndex) => {
            const displayIndex = progress.images.findIndex(img => img.index === image.index);
            return (
              <div key={image.index} className="relative group">
                <div 
                  className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
                  onClick={() => handleImageClick(image, originalIndex)}
                >
                  <img
                    src={image.url}
                    alt={`Generated ${displayIndex + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageClick(image, originalIndex); }}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                      title="View full size"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDownloadImage?.(image.url, originalIndex); }}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    {onRegenerateImage && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onRegenerateImage?.(image.index); }}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        title="Regenerate"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {displayIndex + 1}
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No images generated yet</p>
          <p className="text-gray-500 text-sm">Images will appear here as they complete</p>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            <img src={selectedImage.image.url} alt={`Generated ${selectedImage.index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
            <button className="absolute top-4 right-4 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100" onClick={() => setSelectedImage(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### TASK 9B.2: Create Error Recovery Component

**File:** `src/components/GenerationErrorRecovery.jsx` (NEW FILE)

```javascript
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

export function GenerationErrorRecovery({ progress, onRetryFailed = null, onRemoveFailed = null, onRetryAll = null }) {
  if (!progress) return null;

  const failedImages = progress.images.filter(img => img.status === 'error');
  if (failedImages.length === 0) return null;

  const handleRetryFailed = () => {
    const failedPrompts = failedImages.map(img => ({ index: img.index, prompt: img.prompt }));
    onRetryFailed?.(failedPrompts);
  };

  const handleRemoveFailed = () => {
    const failedIndexes = failedImages.map(img => img.index);
    onRemoveFailed?.(failedIndexes);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-900 mb-1">Generation Issues Detected</h4>
          <p className="text-sm text-yellow-700 mb-3">
            {failedImages.length} image{failedImages.length > 1 ? 's' : ''} failed to generate. 
            You can retry them or continue with the successful ones.
          </p>
          
          <div className="mb-4 space-y-2">
            {failedImages.map((image) => (
              <div key={image.index} className="flex items-center justify-between text-sm bg-white rounded border border-yellow-200 p-2">
                <div>
                  <span className="font-medium">Image {progress.images.findIndex(img => img.index === image.index) + 1}:</span>
                  <span className="text-gray-600 ml-2">{image.prompt}</span>
                </div>
                <div className="text-red-600 text-xs">{image.error}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRetryFailed}
              className="bg-yellow-600 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-700 flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Retry Failed
            </button>
            <button
              onClick={handleRemoveFailed}
              className="bg-white text-yellow-700 border border-yellow-300 px-3 py-1.5 rounded text-sm hover:bg-yellow-50 flex items-center gap-1"
            >
              <Trash2 size={14} />
              Remove Failed
            </button>
            {onRetryAll && (
              <button onClick={onRetryAll} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                Regenerate All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Integration

### TASK 9B.3: Update ProductCard

Add imports and state to `src/components/ProductCard.jsx`:

```javascript
import { GenerationProgress } from './GenerationProgress';
import { IncrementalImageDisplay } from './IncrementalImageDisplay';
import { GenerationErrorRecovery } from './GenerationErrorRecovery';
import { ImageGenerationProgress } from '../utils/imageGeneration';

// Add to component state
const [generationProgress, setGenerationProgress] = useState(null);

// Add progress callback to generation function
const onProgress = (index, status, data) => {
  progress.updateImage(index, status, { prompt: angles[index], url: data, error: data });
  setGenerationProgress({ ...progress });
};

// Add to JSX render (before existing images)
{generationProgress && (
  <>
    <GenerationProgress progress={generationProgress} onCancel={() => setGenerationProgress(null)} />
    <GenerationErrorRecovery progress={generationProgress} onRetryFailed={handleRetryFailed} onRemoveFailed={handleRemoveFailed} />
    {generationProgress.images.some(img => img.status === 'success') && (
      <IncrementalImageDisplay progress={generationProgress} onImageClick={handleImageClick} onDownloadImage={handleDownloadImage} />
    )}
  </>
)}
```

---

## Testing

Test incremental display:
```javascript
const [testProgress, setTestProgress] = useState(null);

const testIncremental = () => {
  const p = new ImageGenerationProgress(5);
  setTestProgress(p);
  
  // Simulate incremental completion
  [1000, 2000, 3000, 4000, 5000].forEach((delay, i) => {
    setTimeout(() => {
      p.updateImage(i, 'success', `https://picsum.photos/200/200?random=${i}`);
      setTestProgress({ ...p });
    }, delay);
  });
};

// Render: {testProgress && <IncrementalImageDisplay progress={testProgress} onDownloadImage={handleDownload} />}
```

---

**Phase 9B Status:** READY FOR IMPLEMENTATION
**Next:** PHASE 10 - Complete integration and testing
**Time:** 30-45 min | **Files:** 2 new, 1 modified
