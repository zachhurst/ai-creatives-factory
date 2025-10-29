import { Loader, CheckCircle, XCircle } from 'lucide-react';

export function GenerationStatusIndicator({ progress, compact = false }) {
  if (!progress) return null;
  const { total, completed, successful, failed, percentage, elapsedTime } = progress.getProgress();
  
  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };
  
  const getIcon = () => {
    if (completed === 0) return <Loader size={16} className="animate-spin text-blue-600" />;
    if (completed === total) return failed > 0 ? <XCircle size={16} className="text-yellow-600" /> : <CheckCircle size={16} className="text-green-600" />;
    return <Loader size={16} className="animate-spin text-blue-600" />;
  };
  
  const getText = () => {
    if (completed === 0) return 'Starting...';
    if (completed === total) return failed > 0 ? `Complete (${successful}/${total})` : 'Complete';
    return `Generating... ${completed}/${total}`;
  };
  
  const getColor = () => {
    if (completed === total) return failed > 0 ? 'text-yellow-600' : 'text-green-600';
    return 'text-blue-600';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {getIcon()}<span className={getColor()}>{getText()}</span><span className="text-gray-500">({formatTime(elapsedTime)})</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <div className={`font-medium ${getColor()}`}>{getText()}</div>
            <div className="text-sm text-gray-500">{successful} successful, {failed} failed • {formatTime(elapsedTime)}</div>
          </div>
        </div>
        <div className="relative">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" 
              strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentage / 100)}`} className={getColor()} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-medium">{percentage}%</span></div>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all ${failed > 0 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}
