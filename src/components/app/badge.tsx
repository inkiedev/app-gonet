import { useTheme } from '@/contexts/theme-context';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  style?: ViewStyle;
  children: ReactNode;
  size?: number;
  variant?: BadgeVariant;
  color?: string;
  masked?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  style, 
  children, 
  size = 20, 
  variant = 'primary', 
  color 
}) => {
  if (!children) return null;
  
  const { theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme, size, variant, color);

  return (
    <View style={[dynamicStyles.badge, style]}>
      {children}
    </View>
  );
};

const getSizeStyles = (size: number) => {
  return {
    minWidth: size,
    height: size,
  };
};

const getVariantColor = (theme: any, variant: BadgeVariant) => {
  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'secondary':
      return theme.colors.secondary || theme.colors.primaryDark;
    case 'success':
      return theme.colors.success || '#10B981';
    case 'warning':
      return theme.colors.warning || '#F59E0B';
    case 'danger':
      return theme.colors.danger || '#EF4444';
    default:
      return theme.colors.primary;
  }
};

const createDynamicStyles = (theme: any, size: number = 20, variant: BadgeVariant = 'primary', customColor?: string) => {
  const sizeStyles = getSizeStyles(size);
  const backgroundColor = customColor || getVariantColor(theme, variant);
  
  return StyleSheet.create({
    badge: {
      minWidth: sizeStyles.minWidth,
      height: sizeStyles.height,
      borderRadius: size / 2, // Radio proporcional al tamaño
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Math.max(size * 0.2, 4), // Padding proporcional, mínimo 4
    },
  });
};

export default Badge;

