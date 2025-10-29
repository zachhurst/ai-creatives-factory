import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { ImageGenerationStatus } from '../utils/imageGeneration';

export function GenerationProgress({ progress, onCancel = null }) {
  if (!progress) return null;
  const { total, completed, successful, failed, percentage, elapsedTime } = progress.getProgress();
  
  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };
  
  const getIcon = (status) => {
    if (status === ImageGenerationStatus.GENERATING) return <Loader size={16} className="animate-spin text-blue-600" />;
    if (status === ImageGenerationStatus.SUCCESS) return <CheckCircle size={16} className="text-green-600" />;
    if (status === ImageGenerationStatus.ERROR) return <XCircle size={16} className="text-red-600" />;
    return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
  };
  
  const getColor = (status) => {
    if (status === ImageGenerationStatus.GENERATING) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === ImageGenerationStatus.SUCCESS) return 'bg-green-100 text-green-800 border-green-200';
    if (status === ImageGenerationStatus.ERROR) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Generating Images</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={16} /><span>{formatTime(elapsedTime)}</span>
          </div>
          {onCancel && <button onClick={onCancel} className="text-sm text-red-600 hover:text-red-800">Cancel</button>}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{completed}/{total} ({percentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{successful} successful</span><span>{failed} failed</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Image Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {progress.images.map((img, i) => (
            <div key={i} className={`border rounded-lg p-3 ${getColor(img.status)}`}>
              <div className="flex gap-3">
                {getIcon(img.status)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-1">Image {i + 1}</div>
                  {img.prompt && <div className="text-xs text-gray-600 mb-2 truncate">{img.prompt}</div>}
                  {img.url ? (
                    <img src={img.url} alt={`Gen ${i + 1}`} className="w-full h-24 object-cover rounded border" />
                  ) : img.status === ImageGenerationStatus.GENERATING ? (
                    <div className="w-full h-24 bg-gray-100 rounded border flex items-center justify-center">
                      <Loader size={20} className="animate-spin text-gray-500" />
                    </div>
                  ) : img.status === ImageGenerationStatus.ERROR ? (
                    <div className="w-full h-24 bg-red-50 rounded border-red-200 flex items-center justify-center">
                      <XCircle size={20} className="text-red-600" />
                    </div>
                  ) : (
                    <div className="w-full h-24 bg-gray-50 rounded border flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full" />
                    </div>
                  )}
                  {img.error && <div className="text-xs text-red-600 mt-2">{img.error}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {progress.isComplete() && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} className="text-blue-600" />
          <div>
            <div className="text-sm font-medium text-blue-900">Generation Complete</div>
            <div className="text-xs text-blue-700">
              {successful} of {total} images in {formatTime(elapsedTime)}{failed > 0 && ` (${failed} failed)`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
