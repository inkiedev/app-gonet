import { theme } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface Section {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SectionNavigatorProps {
  sections: Section[];
  initialSectionId?: string;
  onSectionChange?: (sectionId: string, index: number) => void;
  variant?: 'modern' | 'minimal' | 'pill' | 'underline';
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  animated?: boolean;
  animateContent?: boolean; // New prop to control content animation
}

const { width: screenWidth } = Dimensions.get('window');

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  initialSectionId,
  onSectionChange,
  variant = 'modern',
  containerStyle,
  headerStyle,
  contentStyle,
  animated = true,
  animateContent = false, // Default to false for smoother experience
}) => {
  // State
  const [activeIndex, setActiveIndex] = useState(() => {
    if (initialSectionId) {
      const index = sections.findIndex(section => section.id === initialSectionId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // Animations
  const indicatorPosition = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const contentScale = useSharedValue(1);

  const sectionWidth = screenWidth / sections.length;

  const handleSectionPress = useCallback((index: number) => {
    if (index === activeIndex) return;

    const section = sections[index];
    
    setActiveIndex(index);
    onSectionChange?.(section.id, index);
    
    if (animated) {
      if (animateContent) {
        // Scale + Fade como App Store - muy elegante
        contentScale.value = withTiming(0.95, { duration: 120 }, (finished) => {
          if (finished) {
            contentScale.value = withSpring(1, {
              damping: 15,
              stiffness: 300,
              mass: 0.8,
            });
          }
        });
        
        contentOpacity.value = withTiming(0.65, { duration: 120 }, (finished) => {
          if (finished) {
            contentOpacity.value = withTiming(1, { duration: 180 });
          }
        });
      }
      
      // Animación suave del indicador
      indicatorPosition.value = withSpring(index * sectionWidth, {
        damping: 20,
        stiffness: 250,
        mass: 0.8,
      });
    } else {
      indicatorPosition.value = index * sectionWidth;
    }
  }, [activeIndex, sections, sectionWidth, animated, animateContent, contentOpacity, contentScale, indicatorPosition, onSectionChange]);

  const indicatorStyle = useAnimatedStyle(() => {
    if (variant === 'underline') {
      return {
        transform: [{ translateX: indicatorPosition.value }],
        width: sectionWidth,
      };
    }
    
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: sectionWidth - theme.spacing.sm,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    if (animateContent) {
      return {
        opacity: contentOpacity.value,
        transform: [{ scale: contentScale.value }],
      };
    }
    return {}; // No animation styles if animateContent is false
  });

  React.useEffect(() => {
    indicatorPosition.value = activeIndex * sectionWidth;
  }, [activeIndex, sectionWidth, indicatorPosition]);

  const renderSectionButton = (section: Section, index: number) => {
    const isActive = index === activeIndex;

    const buttonStyle = (() => {
      switch (variant) {
        case 'pill':
          return [
            styles.pillButton,
            isActive && styles.pillButtonActive,
          ];
        case 'minimal':
          return [
            styles.minimalButton,
            isActive && styles.minimalButtonActive,
          ];
        case 'underline':
          return [
            styles.underlineButton,
          ];
        default: // modern
          return [
            styles.modernButton,
          ];
      }
    })();

    const textStyle = (() => {
      switch (variant) {
        case 'pill':
          return [
            styles.pillButtonText,
            isActive && styles.pillButtonTextActive,
          ];
        case 'minimal':
          return [
            styles.minimalButtonText,
            isActive && styles.minimalButtonTextActive,
          ];
        case 'underline':
          return [
            styles.underlineButtonText,
            isActive && styles.underlineButtonTextActive,
          ];
        default: // modern
          return [
            styles.modernButtonText,
            isActive && styles.modernButtonTextActive,
          ];
      }
    })();

    return (
      <TouchableOpacity
        key={section.id}
        style={buttonStyle}
        onPress={() => handleSectionPress(index)}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          {section.icon && (
            <View style={styles.iconContainer}>
              {section.icon}
            </View>
          )}
          <Text style={textStyle} numberOfLines={1}>
            {section.label}
          </Text>
          {section.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {section.badge}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render indicator
  const renderIndicator = () => {
    if (variant === 'pill' || variant === 'minimal') return null;

    if (variant === 'underline') {
      return (
        <Animated.View style={[styles.underlineIndicator, indicatorStyle]} />
      );
    }

    // Modern variant with gradient indicator
    return (
      <Animated.View style={[styles.modernIndicator, indicatorStyle]}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.modernIndicatorGradient}
        />
      </Animated.View>
    );
  };

  // Get header container style based on variant
  const getHeaderContainerStyle = () => {
    switch (variant) {
      case 'pill':
        return styles.pillHeader;
      case 'minimal':
        return styles.minimalHeader;
      case 'underline':
        return styles.underlineHeader;
      default:
        return styles.modernHeader;
    }
  };

  const activeSection = sections[activeIndex];

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header with navigation */}
      <View style={[getHeaderContainerStyle(), headerStyle]}>
        <View style={styles.sectionButtons}>
          {sections.map(renderSectionButton)}
        </View>
        {renderIndicator()}
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle, contentStyle]}>
        {activeSection?.content}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Headers
  modernHeader: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  pillHeader: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  
  minimalHeader: {
    backgroundColor: 'transparent',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: 0,
  },
  
  underlineHeader: {
    backgroundColor: 'transparent',
    marginBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    position: 'relative',
  },

  // Section buttons container
  sectionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Button content
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },

  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },

  // Modern variant buttons
  modernButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  modernButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  modernButtonTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.semibold,
  },

  // Pill variant buttons
  pillButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: 'transparent',
  },

  pillButtonActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  pillButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  pillButtonTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.semibold,
  },

  // Minimal variant buttons
  minimalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: 'transparent',
  },

  minimalButtonActive: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },

  minimalButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  minimalButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  // Underline variant buttons
  underlineButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'transparent',
  },

  underlineButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  underlineButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  // Indicators
  modernIndicator: {
    position: 'absolute',
    bottom: theme.spacing.xs,
    left: theme.spacing.xs,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },

  modernIndicatorGradient: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
  },

  underlineIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default SectionNavigator;