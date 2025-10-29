import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function AlertDialog({ open, onOpenChange, title, description, variant = 'info', actionText = 'OK', onAction }) {
  if (!open) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: <CheckCircle size={24} className="text-green-600" />,
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          subTextColor: 'text-green-700',
          buttonBg: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: <AlertTriangle size={24} className="text-red-600" />,
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          subTextColor: 'text-red-700',
          buttonBg: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} className="text-yellow-600" />,
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-900',
          subTextColor: 'text-yellow-700',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          icon: <AlertTriangle size={24} className="text-blue-600" />,
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          subTextColor: 'text-blue-700',
          buttonBg: 'bg-blue-600 hover:bg-blue-700'
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
            <p className={`text-sm ${styles.subTextColor}`}>
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAction?.();
              onOpenChange(false);
            }}
            className={`px-4 py-2 text-sm font-medium text-white ${styles.buttonBg} rounded-lg transition-colors`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Hook for using alerts
export function useAlert() {
  const [alert, setAlert] = useState(null);

  const showAlert = (options) => {
    setAlert({
      ...options,
      open: true
    });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const AlertComponent = () => (
    <AlertDialog
      open={alert?.open || false}
      onOpenChange={(open) => !open && hideAlert()}
      title={alert?.title || 'Alert'}
      description={alert?.description || ''}
      variant={alert?.variant || 'info'}
      actionText={alert?.actionText || 'OK'}
      onAction={alert?.onAction}
    />
  );

  return { showAlert, hideAlert, AlertComponent };
}
