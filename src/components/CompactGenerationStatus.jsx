import { Loader, CheckCircle, XCircle } from 'lucide-react';

export function CompactGenerationStatus({ progress }) {
  if (!progress) return null;
  const { total, completed, successful, failed, elapsedTime } = progress.getProgress();
  
  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };
  
  const getIcon = () => {
    if (completed === 0) return <Loader size={14} className="animate-spin text-blue-600" />;
    if (completed === total) return failed > 0 ? <XCircle size={14} className="text-yellow-600" /> : <CheckCircle size={14} className="text-green-600" />;
    return <Loader size={14} className="animate-spin text-blue-600" />;
  };
  
  const getText = () => {
    if (completed === 0) return 'Starting...';
    if (completed === total) return failed > 0 ? `Done (${failed} errors)` : 'All complete';
    return `${completed}/${total} ready`;
  };
  
  const getColor = () => {
    if (completed === total) return failed > 0 ? 'text-yellow-600' : 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg">
      {getIcon()}
      <span className={`font-medium ${getColor()}`}>{getText()}</span>
      <span className="text-gray-500 text-xs">({formatTime(elapsedTime)})</span>
      {successful > 0 && <span className="text-green-600 text-xs">✓{successful}</span>}
      {failed > 0 && <span className="text-red-600 text-xs">✗{failed}</span>}
    </div>
  );
}
