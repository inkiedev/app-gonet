import React, { useEffect } from 'react';
import { Text, TextInput, Platform } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

interface TextOverrideProviderProps {
  children: React.ReactNode;
}

// Store original renders to avoid infinite loops
let originalTextRender: any;
let originalTextInputRender: any;
let hasPatched = false;

export const TextOverrideProvider: React.FC<TextOverrideProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!hasPatched) {
      // Store original renders
      originalTextRender = (Text as any).render;
      originalTextInputRender = (TextInput as any).render;
      hasPatched = true;
    }

    // Set default props with theme
    (Text as any).defaultProps = {
      ...(Text as any).defaultProps,
      style: {
        fontFamily: theme.fontFamily.regular,
        color: theme.colors.text.primary,
        ...((Text as any).defaultProps?.style || {})
      }
    };

    (TextInput as any).defaultProps = {
      ...(TextInput as any).defaultProps,
      style: {
        fontFamily: theme.fontFamily.regular,
        color: theme.colors.text.primary,
        ...((TextInput as any).defaultProps?.style || {})
      },
      placeholderTextColor: theme.colors.text.disabled,
    };
  }, [theme]);

  return <>{children}</>;
};