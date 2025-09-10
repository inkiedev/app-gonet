import { useTheme } from '@/contexts/theme-context';
import { usePathname } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';

export const ThemedStatusBar: React.FC = () => {
  const { isDark, theme } = useTheme();
  const pathname = usePathname();

  // Only apply theme on /home routes, otherwise use light
  const isHomeRoute = pathname?.includes('/home');
  const statusBarStyle = isHomeRoute ? (isDark ? 'light' : 'dark') : 'dark';

  return (
    <ExpoStatusBar
      style={statusBarStyle}
      animated
    />
  );
};