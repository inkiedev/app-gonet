import Text from '@/components/ui/custom-text';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

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
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  const cardStyle: ViewStyle[] = [
    dynamicStyles.base,
    dynamicStyles[variant],
    style as ViewStyle,
  ];

  return (
    <View style={cardStyle} testID={testID}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerText}>{title}</Text>
      </View>
      <View style={dynamicStyles.content}>
        {children}
      </View>
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
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