import { Footer } from '@/components/layout/footer';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { useTheme } from '@/contexts/theme-context';
import { useAuthRoute } from '@/providers/auth-route-provider';
import { RootState } from '@/store';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const ProtectedLayoutContent: React.FC = () => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const { showFooter } = useCardExpansion();
  const { isInitialized } = useAuthRoute();
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={dynamicStyles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Redirect if not authenticated or needs biometric verification
  if (!isAuthenticated || needsBiometricVerification) {
    return <Redirect href="/" />;
  }

  return (
    <LinearGradient
      colors={['#ffffff', '#dfdfdfff', '#ffffff']}
      locations={[0.1, 0.5, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={dynamicStyles.content}
    >
      <View style={dynamicStyles.container}>
        <Slot />

        {showFooter && 
          <Animated.View exiting={FadeOutDown.duration(400)} entering={FadeInDown.duration(400)}>
            <Footer />
          </Animated.View>
        }
      </View>
    </LinearGradient>
  );
};

export default function ProtectedLayout() {
  return (
    <SafeAreaProvider>
      <ProtectedLayoutContent />
    </SafeAreaProvider>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
});