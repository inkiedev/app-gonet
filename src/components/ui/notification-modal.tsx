import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { NotificationModalProps, NotificationType } from '@/types/notification';
import { Button } from './custom-button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getNotificationConfig = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: theme.colors.success,
        icon: 'checkmark-circle' as const,
        color: '#ffffff',
      };
    case 'error':
      return {
        backgroundColor: theme.colors.error,
        icon: 'close-circle' as const,
        color: '#ffffff',
      };
    case 'warning':
      return {
        backgroundColor: theme.colors.warning,
        icon: 'warning' as const,
        color: '#ffffff',
      };
    case 'info':
      return {
        backgroundColor: theme.colors.primary,
        icon: 'information-circle' as const,
        color: '#ffffff',
      };
    default:
      return {
        backgroundColor: theme.colors.primary,
        icon: 'information-circle' as const,
        color: '#ffffff',
      };
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (notification) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [notification]);

  const handleClose = () => {
    notification?.onClose?.();
    onClose();
  };

  if (!notification) {
    return null;
  }

  const config = getNotificationConfig(notification.type);

  return (
    <Modal
      visible={!!notification}
      transparent
      animationType="none"
      statusBarTranslucent={false}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidOverlay]} />
        )}
        
        <SafeAreaView style={styles.safeAreaContainer} edges={['top']}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={[styles.content, { backgroundColor: config.backgroundColor }]}>
              <View style={styles.header}>
                <View style={styles.iconTitleRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={config.icon}
                      size={24}
                      color={config.color}
                    />
                  </View>
                  <Text style={[styles.title, { color: config.color }]}>
                    {notification.title}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color={config.color} />
                </TouchableOpacity>
              </View>

              {notification.message && (
                <Text style={[styles.message, { color: config.color }]}>
                  {notification.message}
                </Text>
              )}

              {notification.action && (
                <View style={styles.actionContainer}>
                  <Button
                    title={notification.action.label}
                    onPress={notification.action.onPress}
                    variant="outline"
                    size="sm"
                    style={[
                      styles.actionButton,
                      { borderColor: config.color }
                    ]}
                  />
                </View>
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  androidOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  container: {
    width: SCREEN_WIDTH - (theme.spacing.md * 2),
    maxWidth: 400,
    position: 'absolute',
    top: 0,
  },
  content: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  message: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.normal,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  actionContainer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});