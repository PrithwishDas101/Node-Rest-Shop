import React from 'react';
import { Button } from './Button';

export function Modal({ 
  isOpen, 
  title, 
  children, 
  onClose, 
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {onConfirm && (
          <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={isDangerous ? 'danger' : 'primary'}
              onClick={onConfirm}
              isLoading={isLoading}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
