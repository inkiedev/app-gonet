import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface PlanCardProps extends BaseComponentProps {
  title: string;
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const PlanCard: React.FC<PlanCardProps> = ({
  title,
  children,
  variant = 'elevated',
  style,
  testID,
}) => {
  const cardStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    style as ViewStyle,
  ];

  return (
    <View style={cardStyle} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  flat: {
  },
  header: {
    backgroundColor: theme.colors.text.contrast,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.fontSize.xxl * 1.5,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
});