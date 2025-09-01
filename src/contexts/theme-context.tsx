import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  lightgreen: string;
  darkgreen: string;
  shadow: string;
  text: {
    primary: string;
    contrast: string;
    secondary: string;
    inverse: string;
    disabled: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
}

export interface ThemeType {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    full: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    huge: number;
  };
  fontFamily: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  fontWeight: {
    normal: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
    bolder: '800';
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

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
  },
  border: {
    light: '#e0e0e0',
    medium: '#cccccc',
    dark: '#999999',
  },
};

const darkColors: ThemeColors = {
  primary: '#00fe9b',
  primaryDark: '#00c497',
  secondary: '#07938d',
  background: '#121212',
  surface: '#1e1e1e',
  error: '#ff6b6b',
  success: '#00dd55',
  warning: '#ffcc44',
  lightgreen: '#CCDD33',
  darkgreen: '#2a9977',
  shadow: '#000000',
  text: {
    primary: '#ffffff',
    contrast: '#bb66dd',
    secondary: '#cccccc',
    inverse: '#333333',
    disabled: '#777777',
  },
  border: {
    light: '#333333',
    medium: '#555555',
    dark: '#777777',
  },
};

const baseTheme = {
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

const lightTheme: ThemeType = {
  ...baseTheme,
  colors: lightColors,
};

const darkTheme: ThemeType = {
  ...baseTheme,
  colors: darkColors,
  shadows: {
    sm: {
      ...baseTheme.shadows.sm,
      shadowOpacity: 0.3,
    },
    md: {
      ...baseTheme.shadows.md,
      shadowOpacity: 0.4,
    },
    lg: {
      ...baseTheme.shadows.lg,
      shadowOpacity: 0.5,
    },
  },
};

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get initial color scheme from system
    const colorScheme = Appearance.getColorScheme();
    setIsDark(colorScheme === 'dark');

    // Listen for system color scheme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};