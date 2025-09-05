import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface ImageCarouselProps {
  style?: any;
  height?: number;
}

const { width } = Dimensions.get('window');

const carouselData = [
  {
    id: 1,
    image: require('@/assets/images/publicidad.webp')
  },
  {
    id: 2,
    image: require('@/assets/images/publicidad2.webp')
  },
  {
    id: 3,
    image: require('@/assets/images/publicidad3.webp')
  }
];

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  style, 
  height = 300 
}) => {
  const { theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme);
  const renderCarouselItem = ({ item }: { item: typeof carouselData[0] }) => (
    <View style={[styles.carouselItemContainer, { height }]}>
      <ImageBackground
        source={item.image}
        style={[styles.carouselItem, { height }]}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={[dynamicStyles.container, style]}>
      <Carousel
        loop={true}
        width={width}
        height={height}
        data={carouselData}
        scrollAnimationDuration={1000}
        autoPlay={true}
        autoPlayInterval={5000}
        renderItem={renderCarouselItem}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

const styles = StyleSheet.create({
  carouselItemContainer: {
    width: '100%',
  },
  carouselItem: {
    width: '100%',
    justifyContent: 'space-between',
  },
});