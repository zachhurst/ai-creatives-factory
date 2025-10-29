import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { ImageGenerationStatus } from '../utils/imageGeneration';

export function GenerationProgress({ progress, onCancel }) {
  if (!progress) return null;
  
  const { total, completed, successful, failed, percentage, elapsedTime } = progress.getProgress();
  
  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Generating Images</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={16} />
            <span>{formatTime(elapsedTime)}</span>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="text-sm text-red-600 hover:text-red-800">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{completed}/{total} ({percentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{successful} successful</span>
          <span>{failed} failed</span>
        </div>
      </div>

      {/* Individual Image Status */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Image Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {progress.images.map((img, i) => (
            <div key={i} className={`border rounded-lg p-3 ${getStatusColor(img.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(img.status)}
                <span className="text-sm font-medium">Image {i + 1}</span>
              </div>
              {img.prompt && (
                <div className="text-xs text-gray-600 mb-2 truncate">{img.prompt}</div>
              )}
              {img.url && (
                <img src={img.url} alt={`Gen ${i + 1}`} className="w-full h-24 object-cover rounded" />
              )}
              {img.error && (
                <div className="text-xs text-red-600 mt-2">{img.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completion Summary */}
      {progress.isComplete() && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <CheckCircle size={20} className="inline text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-900">
            Generation Complete: {successful} of {total} images in {formatTime(elapsedTime)}
          </span>
        </div>
      )}
    </div>
  );
}

function getStatusIcon(status) {
  if (status === ImageGenerationStatus.GENERATING) return <Loader size={16} className="animate-spin text-blue-600" />;
  if (status === ImageGenerationStatus.SUCCESS) return <CheckCircle size={16} className="text-green-600" />;
  if (status === ImageGenerationStatus.ERROR) return <XCircle size={16} className="text-red-600" />;
  return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
}

function getStatusColor(status) {
  if (status === ImageGenerationStatus.GENERATING) return 'bg-blue-50 border-blue-200';
  if (status === ImageGenerationStatus.SUCCESS) return 'bg-green-50 border-green-200';
  if (status === ImageGenerationStatus.ERROR) return 'bg-red-50 border-red-200';
  return 'bg-gray-50 border-gray-200';
}
