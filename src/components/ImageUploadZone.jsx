import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImageToFal } from '../services/falService';
import { validateImageFiles, generateLocalImageUrl, revokeLocalImageUrl } from '../utils/helpers';
import { useDialog, dialogHelpers } from './ui/DialogProvider';

export function ImageUploadZone({
  onImagesUploaded,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  disabled = false
}) {
  const { showAlert } = useDialog();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validation = validateImageFiles(fileArray);
    if (!validation.isValid) {
      showAlert(dialogHelpers.validationError(validation.errors));
      return;
    }

    // Check total file limit
    if (uploadedImages.length + fileArray.length > maxFiles) {
      showAlert(dialogHelpers.warning('File Limit', `Maximum ${maxFiles} images allowed`));
      return;
    }

    // Create local previews and start upload
    const newImages = fileArray.map(file => ({
      file,
      localUrl: generateLocalImageUrl(file),
      uploading: true
    }));

    setUploadedImages(prev => [...prev, ...newImages]);

    // Upload each file
    const uploadPromises = newImages.map(async (img, index) => {
      try {
        const remoteUrl = await uploadImageToFal(img.file);
        
        setUploadedImages(prev => prev.map((item, i) => 
          i === prev.length - newImages.length + index 
            ? { ...item, remoteUrl, uploading: false }
            : item
        ));
        
        return remoteUrl;
      } catch (error) {
        setUploadedImages(prev => prev.map((item, i) => 
          i === prev.length - newImages.length + index 
            ? { ...item, uploading: false, error: error.message || 'Upload failed' }
            : item
        ));
        return null;
      }
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
    
    if (uploadedUrls.length > 0) {
      onImagesUploaded(uploadedUrls);
    }
  }, [uploadedImages.length, maxFiles, onImagesUploaded]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      const removed = prev[index];
      
      // Revoke local URL to prevent memory leaks
      if (removed.localUrl) {
        revokeLocalImageUrl(removed.localUrl);
      }
      
      // Update parent with remaining URLs
      const remainingUrls = newImages
        .filter(img => img.remoteUrl)
        .map(img => img.remoteUrl);
      
      onImagesUploaded(remainingUrls);
      
      return newImages;
    });
  }, [onImagesUploaded]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <label
        className={`
          flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-center">
          <Upload 
            size={48} 
            className={`mx-auto mb-3 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} 
          />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {disabled ? 'Upload disabled' : 'Drop images here or click to upload'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB each (max {maxFiles} files)
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Images ({uploadedImages.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                {/* Image Thumbnail */}
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  {img.localUrl ? (
                    <img
                      src={img.localUrl}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Upload Overlay */}
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-xs font-medium">Uploading...</div>
                    </div>
                  )}
                  
                  {/* Error Overlay */}
                  {img.error && (
                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                      <div className="text-white text-xs text-center px-2">
                        <div className="font-medium">Error</div>
                        <div className="opacity-90">{img.error}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                {!img.uploading && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Success Indicator */}
                {img.remoteUrl && !img.uploading && !img.error && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white p-1 rounded-full">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploadedImages.some(img => img.uploading) && (
        <div className="text-sm text-blue-600 font-medium">
          Uploading images... Please wait before submitting.
        </div>
      )}
    </div>
  );
}
