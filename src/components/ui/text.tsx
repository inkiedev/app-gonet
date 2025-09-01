import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

interface ThemedTextProps extends TextProps {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: 'primary' | 'secondary' | 'inverse' | 'disabled' | 'contrast';
  children?: React.ReactNode;
}

export const Text: React.FC<ThemedTextProps> = ({ 
  variant = 'regular', 
  color = 'primary',
  style, 
  children, 
  ...props 
}) => {
  const { theme } = useTheme();

  const getFontFamily = () => {
    switch (variant) {
      case 'medium':
        return theme.fontFamily.medium;
      case 'semiBold':
        return theme.fontFamily.semiBold;
      case 'bold':
        return theme.fontFamily.bold;
      default:
        return theme.fontFamily.regular;
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'secondary':
        return theme.colors.text.secondary;
      case 'inverse':
        return theme.colors.text.inverse;
      case 'disabled':
        return theme.colors.text.disabled;
      case 'contrast':
        return theme.colors.text.contrast;
      default:
        return theme.colors.text.primary;
    }
  };

  return (
    <RNText 
      style={[
        { 
          fontFamily: getFontFamily(),
          color: getTextColor(),
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};