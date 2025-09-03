import { useTheme } from '@/contexts/theme-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StatusBar as RNStatusBar } from 'react-native';

export const ThemedStatusBar: React.FC = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  return <ExpoStatusBar style={isDark ? 'light' : 'dark'} />;
};
