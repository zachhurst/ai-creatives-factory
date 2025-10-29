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
