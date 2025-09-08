import { useTheme } from '@/contexts/theme-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';

export const ThemedStatusBar: React.FC = () => {
  const { isDark, theme } = useTheme();

  return (
    <ExpoStatusBar
      style={isDark ? 'light' : 'dark'}
      animated
    />
  );
};