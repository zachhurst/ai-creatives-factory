import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function ConfirmDialog({ open, onOpenChange, title, description, confirmText = 'Delete', cancelText = 'Cancel', variant = 'danger', onConfirm }) {
  if (!open) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: <AlertTriangle size={24} className="text-yellow-600" />,
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-900',
          subTextColor: 'text-yellow-700',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          icon: <Trash2 size={24} className="text-red-600" />,
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          subTextColor: 'text-red-700',
          confirmBg: 'bg-red-600 hover:bg-red-700'
        };
    }
  };

  const styles = getVariantStyles();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className={`relative bg-white rounded-lg shadow-xl border ${styles.borderColor} p-6 max-w-md w-full transform transition-all`}>
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
            {styles.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${styles.textColor} mb-2`}>
              {title}
            </h3>
            <p className={`text-sm ${styles.subTextColor} mb-4`}>
              {description}
            </p>
            <p className="text-xs text-gray-500 italic">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
            className={`px-4 py-2 text-sm font-medium text-white ${styles.confirmBg} rounded-lg transition-colors flex items-center gap-2`}
          >
            <Trash2 size={16} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Hook for using confirm dialogs
export function useConfirm() {
  const [confirm, setConfirm] = useState(null);

  const showConfirm = (options) => {
    return new Promise((resolve) => {
      setConfirm({
        ...options,
        open: true,
        onConfirm: () => {
          options.onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          options.onCancel?.();
          resolve(false);
        }
      });
    });
  };

  const hideConfirm = () => {
    setConfirm(null);
  };

  const ConfirmComponent = () => (
    <ConfirmDialog
      open={confirm?.open || false}
      onOpenChange={(open) => {
        if (!open) {
          confirm?.onCancel?.();
          hideConfirm();
        }
      }}
      title={confirm?.title || 'Confirm Action'}
      description={confirm?.description || 'Are you sure you want to continue?'}
      confirmText={confirm?.confirmText || 'Confirm'}
      cancelText={confirm?.cancelText || 'Cancel'}
      variant={confirm?.variant || 'danger'}
      onConfirm={confirm?.onConfirm}
    />
  );

  return { showConfirm, hideConfirm, ConfirmComponent };
}
