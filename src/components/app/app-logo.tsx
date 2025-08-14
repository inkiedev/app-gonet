import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';

interface AppLogoProps extends BaseComponentProps {
  size?: number;
  variant?: 'default' | 'small' | 'large';
}

const logoSizes = {
  small: 100,
  default: 200,
  large: 300,
};

export const AppLogo: React.FC<AppLogoProps> = ({
                                                  size,
                                                  variant = 'default',
                                                  style,
                                                  testID,
                                                }) => {
  const logoSize = size || logoSizes[variant];

  const containerStyle: ViewStyle[] = [
    styles.container,
    style as ViewStyle,
  ];

  const imageStyle: ImageStyle = {
    width: logoSize,
    height: logoSize,
  };

  return (
    <View style={containerStyle} testID={testID}>
      <Image
        source={require('@/assets/images/icono-gonet.png')}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  image: {
    backgroundColor: 'transparent',
  },
});
