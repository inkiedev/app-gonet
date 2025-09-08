import React, { createContext, useContext } from 'react';
import { ThemeType, ThemeColors } from '@/contexts/theme-context';

const lightColors: ThemeColors = {
  primary: '#00fe9b',
  primaryDark: '#009a94',
  secondary: '#07938d',
  background: '#f0f0f0',
  surface: '#ffffff',
  error: '#ff4444',
  success: '#00aa44',
  warning: '#ffaa00',
  lightgreen: '#AABF0B',
  darkgreen: '#17775a',
  shadow: '#000000',
  text: {
    primary: '#333333',
    contrast: '#952CAB',
    secondary: '#666666',
    inverse: '#ffffff',
    disabled: '#999999',
    inactive: '#666666',
    button: '#009a94',
    placeholder: '#999999'
  },
  border: {
    light: '#e0e0e0',
    medium: '#cccccc',
    dark: '#009a94',
  },
};

const authTheme: ThemeType = {
  colors: lightColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 30,
    full: 50,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    huge: 32,
  },
  fontFamily: {
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    semiBold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
    extraBold: 'Montserrat_800ExtraBold',
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    bolder: '800' as const,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

interface AuthThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  followSystem: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  setFollowSystem: (followSystem: boolean) => void;
}

const AuthThemeContext = createContext<AuthThemeContextType>({
  theme: authTheme,
  isDark: false,
  followSystem: false,
  toggleTheme: () => {},
  setTheme: () => {},
  setFollowSystem: () => {},
});

export const useTheme = () => {
  const context = useContext(AuthThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within an AuthThemeProvider');
  }
  return context;
};

interface AuthThemeProviderProps {
  children: React.ReactNode;
}

export const AuthThemeProvider: React.FC<AuthThemeProviderProps> = ({ children }) => {
  return (
    <AuthThemeContext.Provider value={{ 
      theme: authTheme, 
      isDark: false, 
      followSystem: false,
      toggleTheme: () => {}, 
      setTheme: () => {}, 
      setFollowSystem: () => {} 
    }}>
      {children}
    </AuthThemeContext.Provider>
  );
};