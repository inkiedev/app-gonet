import { useTheme } from '@/contexts/theme-context';
import React, { useEffect } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAdImages } from '@/store/slices/ads-slice';

interface ImageCarouselProps {
  style?: any;
  height?: number;
}

const { width } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  style,
  height = 300,
}) => {
  const { theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme);

  const dispatch = useDispatch<AppDispatch>();
  const { images, loading } = useSelector((state: RootState) => state.ads);

  console.log('ImageCarousel state from Redux:', { images, loading });

  useEffect(() => {
    dispatch(fetchAdImages());
  }, [dispatch]);

  const renderCarouselItem = ({ item }: { item: { id: number; uri: string } }) => (
    <View style={[styles.carouselItemContainer, { height }]}>
      <ImageBackground
        source={{ uri: item.uri }}
        style={[styles.carouselItem, { height }]}
        resizeMode="cover"
      />
    </View>
  );

  if (loading === 'pending') {
    return (
      <View style={[dynamicStyles.container, style, styles.centered, { height }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (loading === 'succeeded' && images.length === 0) {
    return (
      <View style={[dynamicStyles.container, style, { height }]}>
        <ImageBackground
          source={require('@/assets/images/gonetadsDefault.png')}
          style={[styles.carouselItem, { height }]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[dynamicStyles.container, style]}>
      <Carousel
        loop={images.length > 1}
        width={width}
        height={height}
        data={images}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItemContainer: {
    width: '100%',
  },
  carouselItem: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
