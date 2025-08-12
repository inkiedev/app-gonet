import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Footer } from '@/components/layout/footer';
import { theme } from '@/styles/theme';

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" backgroundColor={theme.colors.background} />

        <View style={styles.content}>
          <Slot />
        </View>

        <Footer />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});
