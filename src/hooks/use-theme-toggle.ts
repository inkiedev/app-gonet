import { useTheme } from '@/contexts/theme-context';

export const useThemeToggle = () => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    setLightTheme: () => setTheme(false),
    setDarkTheme: () => setTheme(true),
  };
};