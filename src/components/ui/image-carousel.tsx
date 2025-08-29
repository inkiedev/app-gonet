import { theme } from '@/styles/theme';
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
    <View style={[styles.container, style]}>
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

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  carouselItemContainer: {
    width: '100%',
  },
  carouselItem: {
    width: '100%',
    justifyContent: 'space-between',
  },
});