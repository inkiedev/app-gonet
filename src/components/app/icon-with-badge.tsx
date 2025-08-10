import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';

interface IconWithBadgeProps extends BaseComponentProps {
  IconComponent: React.ComponentType<IconProps<any>>;
  name: string;
  size?: number;
  color?: string;
  badgeCount?: number | string;
  onPress?: () => void;
  label?: string;
}

export const IconWithBadge: React.FC<IconWithBadgeProps> = ({
                                                              IconComponent,
                                                              name,
                                                              size = 55,
                                                              color = theme.colors.text.primary,
                                                              badgeCount,
                                                              onPress,
                                                              label,
                                                              style,
                                                              testID,
                                                            }) => {
  const showBadge = badgeCount !== undefined && badgeCount !== 0;

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <IconComponent name={name} size={size} color={color} />
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {typeof badgeCount === 'number'
                ? badgeCount > 99 ? '99+' : badgeCount.toString()
                : badgeCount}
            </Text>
          </View>
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconContainer: {
    position: 'relative',
    width: 70,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  label: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
