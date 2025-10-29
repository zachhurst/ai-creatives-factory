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
