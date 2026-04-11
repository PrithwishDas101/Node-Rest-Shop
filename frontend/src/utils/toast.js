// Toast Notification System
let toastId = 0;
const listeners = new Set();

export const toast = {
  success: (message) => notify('success', message),
  error: (message) => notify('error', message),
  info: (message) => notify('info', message),
  loading: (message) => notify('loading', message),
};

function notify(type, message) {
  const id = ++toastId;
  const notification = { id, type, message, timestamp: Date.now() };
  
  // Broadcast to all listeners
  listeners.forEach(listener => listener(notification));
  
  // Auto-remove after 4 seconds (unless loading)
  if (type !== 'loading') {
    setTimeout(() => removeToast(id), 4000);
  }
  
  return id;
}

export function removeToast(id) {
  listeners.forEach(listener => listener({ id, remove: true }));
}

export function useToastListener(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export default toast;
