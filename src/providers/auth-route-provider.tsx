import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { secureStorageService } from '@/services/secure-storage';
import { authService } from '@/services/auth';
import { loadBiometricPreferences, restoreSession, completeBiometricVerification } from '@/store/slices/auth-slice';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

interface AuthRouteContextType {
  isInitialized: boolean;
}

const AuthRouteContext = createContext<AuthRouteContextType>({
  isInitialized: false,
});

interface AuthRouteProviderProps {
  children: ReactNode;
}

export const AuthRouteProvider: React.FC<AuthRouteProviderProps> = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const dispatch = useDispatch();
  const { theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricPending, setBiometricPending] = useState(false);

  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check stored credentials for auto-login
        const storedCredentials = await secureStorageService.getCredentials();
        
        if (storedCredentials) {
          const result = await authService.login({
            username: storedCredentials.username,
            password: storedCredentials.password
          });

          if (result.success && result.user) {
            await dispatch(loadBiometricPreferences() as any);
            dispatch(restoreSession({
              uid: result.user.uid,
              password: storedCredentials.password,
              username: storedCredentials.username,
              rememberMe: true
            }));
          }
        }
      } catch (error) {
        console.error('Auto-login error:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isInitialized]);

  // Handle biometric verification
  useEffect(() => {
    const handleBiometricVerification = async () => {
      if (needsBiometricVerification && !biometricPending && isAuthenticated) {
        setBiometricPending(true);
        
        try {
          const storedPreferences = await secureStorageService.getBiometricPreferences();
          const shouldUseBiometric = storedPreferences?.useBiometricForLogin || false;
          
          if (shouldUseBiometric) {
            const isAvailable = await checkBiometricAvailability();
            if (isAvailable) {
              const result = await authenticateWithBiometrics();
              if (result.success) {
                dispatch(completeBiometricVerification());
              } else {
                // If biometric fails, logout user for security
                router.replace('/');
                return;
              }
            } else {
              dispatch(completeBiometricVerification());
            }
          } else {
            dispatch(completeBiometricVerification());
          }
        } catch (error) {
          console.error('Biometric verification error:', error);
          router.replace('/');
        } finally {
          setBiometricPending(false);
        }
      }
    };

    if (isInitialized && isAuthenticated && needsBiometricVerification) {
      handleBiometricVerification();
    }
  }, [isAuthenticated, needsBiometricVerification, biometricPending, isInitialized, checkBiometricAvailability, authenticateWithBiometrics, dispatch, router]);

  // Route protection logic
  useEffect(() => {
    if (!isInitialized || !navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';
    const inPublicRoot = segments.length === 0 || segments[0] === 'index';

    // If user is fully authenticated (no biometric verification needed)
    if (isAuthenticated && !needsBiometricVerification && !biometricPending) {
      if (inAuthGroup || inPublicRoot) {
        // Redirect authenticated users away from auth/public routes
        router.replace('/(protected)/home/' as any);
      }
    }
    // If user is not authenticated
    else if (!isAuthenticated && !isLoading) {
      if (inProtectedGroup) {
        // Redirect unauthenticated users away from protected routes
        router.replace('/');
      }
    }
    // If user is authenticated but needs biometric verification
    else if (isAuthenticated && needsBiometricVerification && !biometricPending) {
      if (inProtectedGroup) {
        // Keep user out of protected routes until biometric verification
        router.replace('/');
      }
    }
  }, [
    isAuthenticated, 
    needsBiometricVerification, 
    biometricPending, 
    isInitialized, 
    isLoading, 
    segments, 
    navigationState?.key, 
    router
  ]);

  // Show loading screen while initializing or processing biometrics
  if (!isInitialized || isLoading || (isAuthenticated && needsBiometricVerification && biometricPending)) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={currentTheme.colors.primary} />
        <Text style={dynamicStyles.loadingText}>
          {biometricPending ? 'Verificando identidad...' : 'Inicializando...'}
        </Text>
      </View>
    );
  }

  return (
    <AuthRouteContext.Provider value={{ isInitialized }}>
      {children}
    </AuthRouteContext.Provider>
  );
};

export const useAuthRoute = () => {
  const context = useContext(AuthRouteContext);
  if (!context) {
    throw new Error('useAuthRoute must be used within AuthRouteProvider');
  }
  return context;
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
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