import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

interface ThemedTextInputProps extends TextInputProps {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
}

export const TextInput: React.FC<ThemedTextInputProps> = ({ 
  variant = 'regular', 
  style, 
  placeholderTextColor,
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

  return (
    <RNTextInput 
      style={[
        { 
          fontFamily: getFontFamily(),
          color: theme.colors.text.primary,
        }, 
        style
      ]} 
      placeholderTextColor={placeholderTextColor || theme.colors.text.disabled}
      {...props}
    />
  );
};