import { Footer } from '@/components/layout/footer';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const LayoutContent: React.FC = () => {
  const { showFooter } = useCardExpansion();
  
  return (
    <LinearGradient
        colors={['#ffffff', '#dfdfdfff', '#ffffff']}
        locations={[0.1, 0.5, 0.9]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}
    >
      <View style={styles.container}>
        <StatusBar style="dark" />

        <Slot />

        {showFooter && 
          <Animated.View exiting={FadeOutDown.duration(400)} entering={FadeInDown.duration(400)} >
            <Footer />
          </Animated.View>
        }
      </View>
    </LinearGradient>
  );
};

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <LayoutContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
