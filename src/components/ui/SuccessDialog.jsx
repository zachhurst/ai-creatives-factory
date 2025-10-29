import React, { useEffect } from 'react';
import { CheckCircle, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function SuccessDialog({ open, onOpenChange, title, description, actionText = 'Great!', onAction, autoClose = true, autoCloseDelay = 3000 }) {
  if (!open) return null;

  // Auto-close functionality
  useEffect(() => {
    if (autoClose && open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onOpenChange, open]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl border border-green-200 p-6 max-w-md w-full transform transition-all scale-100">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-green-700">
              {description}
            </p>
          </div>
        </div>

        {/* Sparkle decorations */}
        <div className="absolute -top-2 -left-2 text-yellow-400">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 text-yellow-400">
          <Sparkles size={16} className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute -bottom-2 -left-2 text-yellow-400">
          <Sparkles size={16} className="animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              onAction?.();
              onOpenChange(false);
            }}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Sparkles size={16} />
            {actionText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Hook for using success dialogs
export function useSuccess() {
  const [success, setSuccess] = useState(null);

  const showSuccess = (options) => {
    setSuccess({
      ...options,
      open: true
    });
  };

  const hideSuccess = () => {
    setSuccess(null);
  };

  const SuccessComponent = () => (
    <SuccessDialog
      open={success?.open || false}
      onOpenChange={(open) => !open && hideSuccess()}
      title={success?.title || 'Success!'}
      description={success?.description || 'Action completed successfully.'}
      actionText={success?.actionText || 'Great!'}
      onAction={success?.onAction}
      autoClose={success?.autoClose !== false}
      autoCloseDelay={success?.autoCloseDelay || 3000}
    />
  );

  return { showSuccess, hideSuccess, SuccessComponent };
}
