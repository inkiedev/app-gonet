import { useTheme } from '@/contexts/theme-context';
import { NotificationModalProps, NotificationType } from '@/types/notification';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './custom-button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getNotificationConfig = (type: NotificationType, themeColors: any) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: themeColors.success,
        icon: 'checkmark-circle' as const,
        color: '#ffffff',
      };
    case 'error':
      return {
        backgroundColor: themeColors.error,
        icon: 'close-circle' as const,
        color: '#ffffff',
      };
    case 'warning':
      return {
        backgroundColor: themeColors.warning,
        icon: 'warning' as const,
        color: '#ffffff',
      };
    case 'info':
      return {
        backgroundColor: themeColors.primary,
        icon: 'information-circle' as const,
        color: '#ffffff',
      };
    default:
      return {
        backgroundColor: themeColors.primary,
        icon: 'information-circle' as const,
        color: '#ffffff',
      };
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  const { theme: currentTheme } = useTheme();
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (notification) {
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);
      
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
    }
  }, [notification]);

  const animateOut = (callback: () => void) => {
    if (isClosing) return;
    setIsClosing(true);
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsClosing(false);
      callback();
    });
  };

  const handleClose = () => {
    if (isClosing) return;
    animateOut(() => {
      notification?.onClose?.();
      onClose();
    });
  };

  if (!notification) {
    return null;
  }

  const config = getNotificationConfig(notification.type, currentTheme.colors);
  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <View style={styles.absoluteContainer} pointerEvents="box-none">
      <SafeAreaView style={dynamicStyles.safeAreaContainer} edges={['top']} pointerEvents="box-none">
        <Animated.View
          style={[
            dynamicStyles.container,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={[dynamicStyles.content, { backgroundColor: config.backgroundColor }]}>
              <View style={dynamicStyles.header}>
                <View style={dynamicStyles.iconTitleRow}>
                  <View style={dynamicStyles.iconContainer}>
                    <Ionicons
                      name={config.icon}
                      size={24}
                      color={config.color}
                    />
                  </View>
                  <Text style={[dynamicStyles.title, { color: config.color }]}>
                    {notification.title}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={dynamicStyles.closeButton}
                  onPress={handleClose}
                  disabled={isClosing}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color={config.color} />
                </TouchableOpacity>
              </View>

              {notification.message && (
                <Text style={[dynamicStyles.message, { color: config.color }]}>
                  {notification.message}
                </Text>
              )}

              {notification.action && (
                <View style={dynamicStyles.actionContainer}>
                  <Button
                    title={notification.action.label}
                    onPress={notification.action.onPress}
                    variant="outline"
                    size="sm"
                    style={{
                      ...dynamicStyles.actionButton,
                      borderColor: config.color
                    }}
                  />
                </View>
              )}
            </View>
          </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  container: {
    width: SCREEN_WIDTH - (theme.spacing.md * 2),
    maxWidth: 400,
    marginTop: theme.spacing.md,
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

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});