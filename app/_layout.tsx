import { ThemedStatusBar as StatusBar } from '@/components/ui/themed-status-bar';
import { CardExpansionProvider } from '@/contexts/card-expansion-container';
import { NotificationProvider } from '@/contexts/notification-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { AuthRouteProvider } from '@/providers/auth-route-provider';
import { StoreProvider } from '@/providers/store-provider';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import Head from "expo-router/head";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
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
      <ThemeProvider>
        <Head>
          <title>GoNet - Internet de Fibra Óptica</title>
          <meta name="description" content="GoNet - La mejor conexión de internet de fibra óptica para tu hogar y empresa" />
        </Head>
        <StatusBar />
        <GestureHandlerRootView>
          <NotificationProvider>
            <CardExpansionProvider>
              <AuthRouteProvider>
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
                        title: 'GoNet - Bienvenido | Internet de Fibra Óptica',
                        animation: 'fade',
                      }}
                    />
                    <Stack.Screen 
                      name="(auth)" 
                      options={{
                        title: 'Autenticación - GoNet',
                        animation: 'slide_from_bottom',
                        animationDuration: 350,
                      }}
                    />
                    <Stack.Screen 
                      name="(protected)" 
                      options={{
                        title: 'GoNet - Panel de Control',
                        animation: 'slide_from_right',
                        animationDuration: 300,
                      }}
                    />
                    <Stack.Screen 
                      name="+not-found" 
                      options={{
                        title: 'Página no encontrada - GoNet | Error 404',
                      }}
                    />
                  </Stack>
                </View>
              </AuthRouteProvider>
            </CardExpansionProvider>
          </NotificationProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
  },
});
