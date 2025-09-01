import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

interface ThemedViewProps extends ViewProps {
  backgroundType?: 'background' | 'surface' | 'transparent';
  children?: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ 
  backgroundType = 'background',
  style, 
  children, 
  ...props 
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (backgroundType) {
      case 'surface':
        return theme.colors.surface;
      case 'transparent':
        return 'transparent';
      default:
        return theme.colors.background;
    }
  };

  return (
    <View 
      style={[
        { backgroundColor: getBackgroundColor() }, 
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};