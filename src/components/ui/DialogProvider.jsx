import React, { createContext, useContext, useState } from 'react';
import { AlertDialog, useAlert } from './AlertDialog';
import { ConfirmDialog, useConfirm } from './ConfirmDialog';
import { SuccessDialog, useSuccess } from './SuccessDialog';

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const alert = useAlert();
  const confirm = useConfirm();
  const success = useSuccess();

  const value = {
    showAlert: alert.showAlert,
    showConfirm: confirm.showConfirm,
    showSuccess: success.showSuccess
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      <alert.AlertComponent />
      <confirm.ConfirmComponent />
      <success.SuccessComponent />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

// Helper functions for common dialog types
export const dialogHelpers = {
  success: (title, description, options = {}) => ({
    title,
    description,
    variant: 'success',
    ...options
  }),
  
  error: (title, description, options = {}) => ({
    title,
    description,
    variant: 'error',
    ...options
  }),
  
  warning: (title, description, options = {}) => ({
    title,
    description,
    variant: 'warning',
    ...options
  }),
  
  info: (title, description, options = {}) => ({
    title,
    description,
    variant: 'info',
    ...options
  }),
  
  confirmDelete: (itemName, options = {}) => ({
    title: `Delete ${itemName}?`,
    description: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
    confirmText: 'Delete',
    variant: 'danger',
    ...options
  }),
  
  confirmDeleteAll: (options = {}) => ({
    title: 'Delete All Data?',
    description: 'Are you sure you want to delete all products and data? This action cannot be undone.',
    confirmText: 'Delete All',
    variant: 'danger',
    ...options
  }),
  
  generationSuccess: (count, mode = 'text', options = {}) => ({
    title: 'Generation Complete!',
    description: `Successfully generated ${count} creative images ${mode}!`,
    actionText: 'Awesome!',
    autoClose: true,
    ...options
  }),
  
  generationError: (error, options = {}) => ({
    title: 'Generation Failed',
    description: `Failed to generate images: ${error}`,
    variant: 'error',
    ...options
  }),
  
  downloadError: (options = {}) => ({
    title: 'Download Failed',
    description: 'Failed to download image. Please try again.',
    variant: 'error',
    ...options
  }),
  
  validationError: (errors, options = {}) => ({
    title: 'Validation Error',
    description: Array.isArray(errors) ? errors.join('\n') : errors,
    variant: 'error',
    ...options
  })
};
