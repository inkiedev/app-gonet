import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export const Card: React.FC<CardProps> = ({
                                            children,
                                            variant = 'elevated',
                                            padding = 'md',
                                            style,
                                            testID,
                                          }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  const cardStyle: ViewStyle[] = [
    dynamicStyles.base,
    dynamicStyles[variant],
    { padding: theme.spacing[padding] },
    style as ViewStyle,
  ];

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
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
});
