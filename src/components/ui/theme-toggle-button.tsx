import Text from '@/components/ui/custom-text';
import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ThemeToggleButtonProps {
  style?: any;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ style }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        { 
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.border.medium,
        },
        style
      ]}
      onPress={toggleTheme}
    >
      <Text>
        {isDark ? 'Tema Claro' : 'Tema Oscuro'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});