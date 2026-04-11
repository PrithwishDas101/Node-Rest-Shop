import React, { useEffect, useState } from 'react';
import { useToastListener, removeToast } from '../utils/toast';

export function ToastContainer() {
  const [toasts, setToasts] = useState({});

  useEffect(() => {
    const unsubscribe = useToastListener((notification) => {
      if (notification.remove) {
        setToasts(prev => {
          const updated = { ...prev };
          delete updated[notification.id];
          return updated;
        });
      } else {
        setToasts(prev => ({
          ...prev,
          [notification.id]: notification
        }));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {Object.values(toasts).map((toast) => (
        <Toast 
          key={toast.id} 
          {...toast} 
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ id, type, message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 200);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    loading: 'bg-slate-50 border-slate-200 text-slate-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    loading: '⟳',
  };

  return (
    <div
      className={`${isVisible ? 'fade-in' : 'fade-out'} ${colors[type]} border rounded-lg p-4 flex items-start gap-3 shadow-lg`}
    >
      <span className={`text-lg font-bold ${type === 'loading' ? 'animate-spin' : ''}`}>
        {icons[type]}
      </span>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      {type !== 'loading' && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default ToastContainer;
