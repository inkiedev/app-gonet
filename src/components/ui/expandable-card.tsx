import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ExpandableCardProps extends BaseComponentProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  initialExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  renderHeader?: (isExpanded: boolean, onToggle: () => void, rotation: any) => React.ReactNode;
  headerStyle?: ViewStyle;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  icon,
  children,
  initialExpanded = false,
  onToggle,
  renderHeader,
  headerStyle,
  style,
  testID,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const animatedHeight = useRef(new Animated.Value(initialExpanded ? 1 : 0)).current;
  const animatedOpacity = useRef(new Animated.Value(initialExpanded ? 1 : 0)).current;
  const animatedRotation = useRef(new Animated.Value(initialExpanded ? 1 : 0)).current;

  useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedRotation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.exp,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedRotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isExpanded]);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const rotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const cardStyle: ViewStyle[] = [styles.card];
  if (style) cardStyle.push(style);

  const renderDefaultHeader = () => (
    <View style={[styles.cardHeader, headerStyle]}>
      <View style={styles.cardTitleContainer}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons
          name="chevron-down"
          size={20}
          color={theme.colors.text.secondary}
        />
      </Animated.View>
    </View>
  );

  return (
    <View style={cardStyle} testID={testID}>
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {renderHeader ? renderHeader(isExpanded, handleToggle, rotation) : renderDefaultHeader()}
      </TouchableOpacity>
      
      <Animated.View
        style={[
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000],
            }),
            opacity: animatedOpacity,
            overflow: 'hidden',
            marginTop: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, theme.spacing.md],
            }),
            marginBottom: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, theme.spacing.md],
            }),
          },
        ]}
      >
        <View style={styles.cardContent}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardContent: {
    gap: theme.spacing.sm,
  },
});