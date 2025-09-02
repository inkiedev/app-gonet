import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type AppTextProps = TextProps & {
  children: React.ReactNode;
};

const fontMap: Record<string, string> = {
  '100': 'Montserrat_400Regular',
  '200': 'Montserrat_400Regular',
  '300': 'Montserrat_400Regular',
  '400': 'Montserrat_400Regular',
  '500': 'Montserrat_500Medium',
  '600': 'Montserrat_600SemiBold',
  '700': 'Montserrat_700Bold',
  '800': 'Montserrat_700Bold',
  '900': 'Montserrat_700Bold',
  normal: 'Montserrat_400Regular',
  bold: 'Montserrat_700Bold',
};

export default function AppText({ style, children, ...props }: AppTextProps) {
  const flattened = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = flattened?.fontWeight ?? '400';
  const fontFamily = fontMap[weight] || fontMap['400'];

  // 🔑 eliminamos fontWeight para Android, ya que ya resolvimos la variante
  const { fontWeight, ...restStyle } = flattened || {};

  return (
    <Text {...props} style={[restStyle, { fontFamily }]}>
      {children}
    </Text>
  );
}
