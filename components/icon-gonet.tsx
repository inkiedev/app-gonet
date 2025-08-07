import React from 'react';
import {
    Image,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

type CustomImageProps = {
  source?: ImageSourcePropType;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  borderRadius?: number;
  padding?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

// Imagen de respaldo por defecto (puedes reemplazar con otra ruta local)
const defaultImage = require('@/assets/images/icono-gonet.png');

export default function CustomImage({
  source,
  width = 200,
  height = 200,
  borderRadius = 12,
  padding = 20,
  containerStyle,
  imageStyle,
}: CustomImageProps) {
  return (
    <View
      style={[
        {
          padding,
        },
        containerStyle,
      ]}
    >
      <Image
        source={source || defaultImage}
        style={[
          {
            width: typeof width === 'number' || (typeof width === 'string' && width.endsWith('%')) ? width : undefined,
            height: typeof height === 'number' || (typeof height === 'string' && height.endsWith('%')) ? height : undefined,
            borderRadius,
          },
          styles.image,
          imageStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'transparent', // fallback por si hay error al cargar
  },
});
