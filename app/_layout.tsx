import { CardExpansionProvider } from '@/contexts/card-expansion-container';
import { NotificationProvider } from '@/contexts/notification-context';
import { StoreProvider } from '@/providers/store-provider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    Barlow: require('@/assets/fonts/Barlow-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StoreProvider>
      <GestureHandlerRootView>
        <NotificationProvider>
          <CardExpansionProvider>
            <View style={styles.container}>
              <Stack 
                screenOptions={{ 
                  headerShown: false,
                  animation: 'slide_from_right',
                  animationDuration: 300,
                }}
              >
                <Stack.Screen 
                  name="index" 
                  options={{
                    animation: 'fade',
                  }}
                />
                <Stack.Screen 
                  name="(auth)" 
                  options={{
                    animation: 'slide_from_bottom',
                    animationDuration: 350,
                  }}
                />
                <Stack.Screen 
                  name="(tabs)" 
                  options={{
                    animation: 'slide_from_right',
                    animationDuration: 300,
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </View>
          </CardExpansionProvider>
        </NotificationProvider>
      </GestureHandlerRootView>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
