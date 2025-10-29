import { Image as ImageIcon, Eye } from 'lucide-react';
import { hasReferenceImages } from '../utils/helpers';

export function ImagePreview({
  images,
  title = 'Reference Images',
  className = '',
  onImageClick
}) {
  if (!hasReferenceImages({ referenceImages: images })) {
    return null;
  }

  const handleImageClick = (url, index) => {
    if (onImageClick) {
      onImageClick(url, index);
    } else {
      // Default behavior: open in new tab
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <span className="text-xs text-gray-500">({images.length})</span>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick(url, index)}
          >
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
              <img
                src={url}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye 
                  size={16} 
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
            
            {/* Image Number Badge */}
            <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      <p className="text-xs text-gray-500 italic">
        Click any image to view full size
      </p>
    </div>
  );
}
