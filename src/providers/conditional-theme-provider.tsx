import React from 'react';
import { useSegments } from 'expo-router';
import { ThemeProvider } from '@/contexts/theme-context';
import { AuthThemeProvider } from './auth-theme-provider';

interface ConditionalThemeProviderProps {
  children: React.ReactNode;
}

export const ConditionalThemeProvider: React.FC<ConditionalThemeProviderProps> = ({ children }) => {
  const segments = useSegments();
  const isAuthRoute = segments.includes('(auth)');

  if (isAuthRoute) {
    return <AuthThemeProvider>{children}</AuthThemeProvider>;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
};