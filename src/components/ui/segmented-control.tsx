import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '@/styles/theme';

export interface Segment {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SegmentedControlProps {
  segments: Segment[];
  initialSegmentId?: string;
  onSegmentChange?: (segmentId: string, index: number) => void;
  variant?: 'ios' | 'material' | 'glass' | 'minimal';
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tintColor?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  initialSegmentId,
  onSegmentChange,
  variant = 'ios',
  containerStyle,
  contentStyle,
  animated = true,
  size = 'md',
  tintColor = theme.colors.primary,
}) => {
  // State
  const [activeIndex, setActiveIndex] = useState(() => {
    if (initialSegmentId) {
      const index = segments.findIndex(segment => segment.id === initialSegmentId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // Animations
  const selectorPosition = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);
  const contentScale = useSharedValue(1);

  const segmentWidth = (screenWidth - (theme.spacing.lg * 2) - 8) / segments.length;

  // Handlers
  const handleSegmentPress = useCallback((index: number) => {
    if (index === activeIndex) return;

    const segment = segments[index];
    
    setActiveIndex(index);
    onSegmentChange?.(segment.id, index);
    
    if (animated) {
      // Animación ultra-suave del selector - inspirado en iOS
      selectorPosition.value = withSpring(index * segmentWidth, {
        damping: 25,
        stiffness: 400,
        mass: 0.6,
      });

      // Sin animación del contenido - cambio instantáneo para mejor UX
      contentOpacity.value = 1;
    } else {
      selectorPosition.value = index * segmentWidth;
    }
  }, [activeIndex, segments, segmentWidth, animated, selectorPosition, onSegmentChange]);

  // Animated styles
  const selectorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: selectorPosition.value }],
      width: segmentWidth,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1, // Sin animación del contenido - estático
    };
  });

  // Initialize selector position
  React.useEffect(() => {
    selectorPosition.value = activeIndex * segmentWidth;
  }, [activeIndex, segmentWidth, selectorPosition]);

  // Get styles based on variant and size
  const getContainerStyles = () => {
    const baseStyle = [styles.container, styles[`container_${size}`]];
    
    switch (variant) {
      case 'material':
        return [...baseStyle, styles.materialContainer];
      case 'glass':
        return [...baseStyle, styles.glassContainer];
      case 'minimal':
        return [...baseStyle, styles.minimalContainer];
      default: // ios
        return [...baseStyle, styles.iosContainer];
    }
  };

  const getSelectorStyles = () => {
    switch (variant) {
      case 'material':
        return styles.materialSelector;
      case 'glass':
        return styles.glassSelector;
      case 'minimal':
        return styles.minimalSelector;
      default: // ios
        return styles.iosSelector;
    }
  };

  // Render segment button
  const renderSegment = (segment: Segment, index: number) => {
    const isActive = index === activeIndex;
    
    const textStyle = [
      styles.segmentText,
      styles[`segmentText_${size}`],
      isActive ? styles.activeSegmentText : styles.inactiveSegmentText,
      variant === 'minimal' && isActive && { color: tintColor },
    ];

    return (
      <TouchableOpacity
        key={segment.id}
        style={[
          styles.segment,
          { width: segmentWidth },
          styles[`segment_${size}`]
        ]}
        onPress={() => handleSegmentPress(index)}
        activeOpacity={0.7}
      >
        <View style={styles.segmentContent}>
          {segment.icon && (
            <View style={styles.iconContainer}>
              {segment.icon}
            </View>
          )}
          <Text style={textStyle} numberOfLines={1}>
            {segment.label}
          </Text>
          {segment.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {segment.badge}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render selector based on variant
  const renderSelector = () => {
    if (variant === 'glass') {
      return (
        <Animated.View style={[getSelectorStyles(), selectorStyle]}>
          <BlurView intensity={20} style={styles.blurSelector}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.glassGradient}
            />
          </BlurView>
        </Animated.View>
      );
    }

    if (variant === 'material') {
      return (
        <Animated.View style={[getSelectorStyles(), selectorStyle]}>
          <LinearGradient
            colors={[tintColor, `${tintColor}CC`]}
            style={styles.materialGradient}
          />
        </Animated.View>
      );
    }

    if (variant === 'minimal') {
      return (
        <Animated.View style={[getSelectorStyles(), selectorStyle, { backgroundColor: 'transparent' }]}>
          <View style={[styles.minimalLine, { backgroundColor: tintColor }]} />
        </Animated.View>
      );
    }

    // iOS default
    return (
      <Animated.View 
        style={[
          getSelectorStyles(), 
          selectorStyle,
          { backgroundColor: theme.colors.surface }
        ]} 
      />
    );
  };

  const activeSegment = segments[activeIndex];

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Segmented Control */}
      <View style={getContainerStyles()}>
        {/* Background selector */}
        {renderSelector()}
        
        {/* Segments */}
        <View style={styles.segmentsContainer}>
          {segments.map(renderSegment)}
        </View>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle, contentStyle]}>
        {activeSegment?.content}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  // Container variants
  container: {
    position: 'relative',
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },

  container_sm: {
    padding: 2,
  },

  container_md: {
    padding: 4,
  },

  container_lg: {
    padding: 6,
  },

  iosContainer: {
    backgroundColor: theme.colors.border.light,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  materialContainer: {
    backgroundColor: `${theme.colors.primary}15`,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
  },

  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  minimalContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    borderRadius: 0,
    paddingBottom: 0,
  },

  // Segments container
  segmentsContainer: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 2,
  },

  // Individual segment
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  segment_sm: {
    paddingVertical: theme.spacing.xs,
  },

  segment_md: {
    paddingVertical: theme.spacing.sm,
  },

  segment_lg: {
    paddingVertical: theme.spacing.md,
  },

  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Segment text
  segmentText: {
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },

  segmentText_sm: {
    fontSize: theme.fontSize.xs,
  },

  segmentText_md: {
    fontSize: theme.fontSize.sm,
  },

  segmentText_lg: {
    fontSize: theme.fontSize.md,
  },

  activeSegmentText: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  inactiveSegmentText: {
    color: theme.colors.text.secondary,
  },

  // Badge
  badge: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },

  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },

  // Selector variants
  iosSelector: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: '100%',
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 1,
  },

  materialSelector: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    zIndex: 1,
  },

  glassSelector: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    zIndex: 1,
  },

  minimalSelector: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    zIndex: 1,
  },

  // Gradient styles
  materialGradient: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
  },

  glassGradient: {
    flex: 1,
  },

  blurSelector: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
  },

  minimalLine: {
    flex: 1,
    borderRadius: theme.borderRadius.sm,
  },

  // Content
  content: {
    flex: 1,
  },
});

export default SegmentedControl;