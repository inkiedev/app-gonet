import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveConfig {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export const useResponsive = (): ResponsiveConfig => {
  const [screenData, setScreenData] = useState<ScaledSize>(() =>
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const { width = 0, height = 0 } = screenData || {};

  const safeWidth = width || 375; // Fallback a iPhone width
  const safeHeight = height || 667; // Fallback a iPhone height

  return {
    isSmall: safeWidth < 576,
    isMedium: safeWidth >= 576 && safeWidth < 768,
    isLarge: safeWidth >= 768 && safeWidth < 992,
    isTablet: safeWidth >= 768,
    isDesktop: safeWidth >= 992,
    width: safeWidth,
    height: safeHeight,
  };
};
