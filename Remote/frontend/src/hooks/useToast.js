import { useCallback } from 'react';

const useToast = () => {
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    if (window.showToast) {
      return window.showToast(message, type, duration);
    } else {
      // Fallback to console if toast system not available
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }, []);

  const success = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    showToast,
    success,
    error,
    warning,
    info
  };
};

export default useToast;
