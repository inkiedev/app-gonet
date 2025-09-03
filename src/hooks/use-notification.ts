import { useState, useCallback } from 'react';
import { NotificationConfig, NotificationType } from '@/types/notification';

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationConfig | null>(null);

  const showNotification = useCallback((config: Omit<NotificationConfig, 'id'>) => {
    const id = Date.now().toString();
    setNotification({
      ...config,
      id,
      duration: config.duration ?? 4000, // Default 4 seconds
    });
  }, []);

  const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};