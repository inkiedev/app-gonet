import { AuthGuest } from "@/components/auth/auth-guest";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/custom-button";
import { PlanCard } from "@/components/ui/plan-card";
import { useBiometricAuth } from "@/hooks/use-biometric-auth";
import { authService } from "@/services/auth";
import { secureStorageService } from "@/services/secure-storage";
import { RootState } from "@/store";
import { completeBiometricVerification, loadBiometricPreferences, restoreSession } from "@/store/slices/auth-slice";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

interface Plan {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  details: string[];
}

const availablePlans: Plan[] = [
  { 
    id: "p1", 
    name: "GoEssencial 300 Mbps", 
    price: 19.90, 
    finalPrice: 22.89, 
    details: [
      'Hasta 300 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  },
  {
    id: "p2",
    name: "GoPlus 450 Mbps",
    price: 29.90,
    finalPrice: 34.89,
    details: [
      'Hasta 450 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  },
  {
    id: "p3",
    name: "GoPlus 500 Mbps",
    price: 39.90,
    finalPrice: 45.89,
    details: [
      'Hasta 500 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  },
  {
    id: "p4",
    name: "GoConnect 700 Mbps",
    price: 59.90,
    finalPrice: 69.89,
    details: [
      'Hasta 700 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  }
];

const PlanesContent = () => (
  <View style={styles.planesSection}>
    <Text style={styles.sectionTitle}>Nuestros Planes</Text>
    {availablePlans.map((plan) => (
      <PlanCard title={plan.name} style={styles.planCard} key={plan.id}>
        <View style={styles.planContainer}>
          <Text style={styles.planPrice}>Precio: ${plan.price}+imp</Text>
          <Text style={styles.planFinalPrice}>Precio final: ${plan.finalPrice}</Text>
          <View style={styles.planDetails}>
            {plan.details.map((detail, index) => (
              <Text key={index} style={styles.planDetail}>
                {`• ${detail}`}
              </Text>
            ))}
          </View>
          <Button title="Contratar" onPress={() => {}} />
        </View>
      </PlanCard>
    ))}
  </View>
);

export default function PublicHomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [biometricPending, setBiometricPending] = useState(false);
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();

  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
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
      }
    };

    if (!isAuthenticated) {
      checkStoredCredentials();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleBiometricVerification = async () => {
      if (needsBiometricVerification && !biometricPending) {
        setBiometricPending(true);
        
        const storedPreferences = await secureStorageService.getBiometricPreferences();
        const shouldUseBiometric = storedPreferences?.useBiometricForLogin || false;
        
        if (shouldUseBiometric) {
          const isAvailable = await checkBiometricAvailability();
          if (isAvailable) {
            const result = await authenticateWithBiometrics();
            if (result.success) {
              dispatch(completeBiometricVerification());
            } else {
              setBiometricPending(false);
              return;
            }
          } else {
            dispatch(completeBiometricVerification());
          }
        } else {
          dispatch(completeBiometricVerification());
        }
        
        setBiometricPending(false);
      }
    };

    if (isAuthenticated && needsBiometricVerification) {
      handleBiometricVerification();
    }
  }, [isAuthenticated, needsBiometricVerification, biometricPending, checkBiometricAvailability, authenticateWithBiometrics, dispatch]);

  useEffect(() => {
    if (isAuthenticated && !isLoading && !needsBiometricVerification && !biometricPending) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, needsBiometricVerification, biometricPending, router]);

  if (isLoading || biometricPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {biometricPending ? 'Verificando identidad...' : 'Cargando...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <AuthGuest>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView style={styles.scrollContainer}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://picsum.photos/800/400" }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Bienvenido a GoNet</Text>
            <Text style={styles.bannerSubtitle}>Internet de alta velocidad para tu hogar</Text>
            <Button 
              title="Iniciar Sesión" 
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>
        </View>

        {/* Planes Content */}
        <PlanesContent />
      </ScrollView>

        {/* Footer */}
        <Footer />
      </SafeAreaView>
    </AuthGuest>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  bannerContainer: {
    height: 300,
    position: 'relative',
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  bannerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  bannerSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
  },
  planesSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  planCard: {
    marginVertical: theme.spacing.md,
  },
  planContainer: {
    paddingHorizontal: theme.spacing.sm,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  planPrice: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  planFinalPrice: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  planDetails: {
    width: '100%',
    marginVertical: theme.spacing.xs,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  planDetail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
});
