export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  id?: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
  onClose?: () => void;
}

export interface NotificationModalProps {
  notification: NotificationConfig | null;
  onClose: () => void;
}