import Register from '@/assets/icons/register.svg';
import User from '@/assets/icons/user.svg';
import AppLogo from '@/assets/images/iconos gonet app svg_GoneetLogo.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
import MaskedBadge from '@/components/app/masked-badge';
import { Footer } from "@/components/layout/footer";
import { Button } from '@/components/ui/custom-button';
import Text from '@/components/ui/custom-text';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { useNotificationContext } from "@/contexts/notification-context";
import { useTheme } from "@/contexts/theme-context";
import { useResponsive } from "@/hooks/use-responsive";
import { useAuthRoute } from "@/providers/auth-route-provider";
import { getPromotions, Promotion } from '@/services/public-api';
import { RootState } from "@/store";
import { formatGoWord } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const SVG_SIZE = 30;

const iconOptions = [
  {
    SvgComponent: <Soporte width={SVG_SIZE} height={SVG_SIZE} />,
    label: 'Soporte para inicio de sesion',
  },
  {
    SvgComponent: <User width={SVG_SIZE} height={SVG_SIZE} />,
    label: 'Iniciar Sesion',
  },
  {
    SvgComponent: <Register width={SVG_SIZE} height={SVG_SIZE} />,
    label: '¿Nuevo Usuario?\nRegistrate Aqui',
  }
];

export default function PublicHomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isInitialized } = useAuthRoute();
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<Promotion[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const { showSuccess, showError } = useNotificationContext();
  const { height, isTablet } = useResponsive();
  
  if (!isInitialized) {
    return null; 
  }

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const promotions = await getPromotions();
      setPlans(promotions);
    } catch (error) {
      console.error('Error loading plans:', error);
      showError('Error', 'No se pudieron cargar los planes');
    } finally {
      setLoadingPlans(false);
    }
  };

  if (isAuthenticated && !needsBiometricVerification) {
    return <Redirect href="/(protected)/home" />;
  }

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const extractSpeed = (planName: string): string => {
    const numbers = planName.match(/\d+/g);
    return numbers ? numbers[numbers.length - 1] : '0';
  };

  const handleBadgePress = (index: number) => {
    const routes = [
      '/soporte',
      '/login', 
      '/register',
      '/hola',
    ];
    
    router.push(routes[index] as any)
  };

  const styles = createDynamicStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ImageBackground
        source={Platform.OS === 'web' 
          ? require('@/assets/images/iconos gonet app svg_backing desktop.png')
          : require('@/assets/images/iconos gonet app svg_backing.png')
        }
        style={Platform.OS === 'web' ? styles.webBackground : styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <AppLogo style={styles.logo} width={150} height={150} />
          <View style={styles.options}>
            <Text style={styles.title}>BIENVENIDO</Text>
            <View style={[styles.badgeRow, isTablet && { padding: theme.spacing.md }]}>
              {iconOptions.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleBadgePress(index)}
                  activeOpacity={0.7}
                  style={styles.iconContainer}
                >
                  <MaskedBadge
                    key={`masked-${index}-${icon.label}`}
                    size={50}
                    backgroundColor="white"
                    style={styles.maskedBadge}
                    iconSize={SVG_SIZE}
                  >
                    {icon.SvgComponent}
                  </MaskedBadge>
                  <Text style={[styles.badgeText, isTablet && { fontSize: theme.fontSize.xs  }]}>{icon.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.plansSection}>
            <Text style={styles.plansTitle}>Nuestros Planes</Text>
            <ScrollView 
              style={styles.plansScrollView}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {loadingPlans ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Cargando planes...</Text>
                </View>
              ) : (
                plans.map((plan) => (
                  <ExpandableCard
                    key={plan.id}
                    onToggle={(expanded) =>
                      setExpandedPlans((prev) => ({ ...prev, [plan.id]: expanded }))
                    }
                    renderHeader={() => (
                      <View style={styles.planHeader}>
                        <Text style={styles.planName}>{formatGoWord(plan.name)}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={styles.planSpeed}>{extractSpeed(plan.name)}</Text><Text style={styles.planMbps}>Mbps</Text></View>
                        <Text style={styles.planPrice}>${plan.total.toFixed(2)}+imp</Text>
                      </View>
                    )}
                    style={[
                      styles.planCard,
                      expandedPlans[plan.id] ? { paddingBottom: 0 } : undefined,
                    ]}
                    icon={
                      <Ionicons 
                        name="wifi" 
                        size={24} 
                        color={theme.colors.primary} 
                      />
                    }
                  >
                    <View style={styles.planDetails}>
                      <Text style={styles.planCode}>Código: {plan.code}</Text>
                      {plan.extras.map((extra, index) => (
                        <View key={index} style={styles.extraItem}>
                          <Text style={styles.extraName}>{extra.name}</Text>
                          <Text style={styles.extraApp}>{extra.Aplicacion}</Text>
                        </View>
                      ))}
                      <Button
                        title="Contrata Aquí"
                        onPress={handleLogin}
                        size="md"
                        style={styles.contractButton}
                      />
                    </View>
                  </ExpandableCard>
                ))
              )}
            </ScrollView>
          </View>
        </View>
        <Footer style={styles.footer} variant='transparent' />
      </ImageBackground>
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
  },
  banner: {
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 80,
  },
  logo: {
    marginTop: 20,
    marginBottom: 16,
  },
  options: {
    width: '100%',
    maxWidth: 800,
    flexDirection: 'column',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    width: '95%',
    marginTop: theme.spacing.lg,
  },
  badge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: theme.fontSize.xs,
    wordWrap: 'wrap',
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    padding: theme.spacing.xs,
    paddingTop: 10
  },
  maskedBadge: {
    
  },
  iconContainer: {
    width: '33%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
  },
  webBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      minWidth: '100vw',
    }),
  } as any,
  title: {
    color: '#ffffff',
    fontWeight: theme.fontWeight.normal,
    fontSize: 18,
    letterSpacing: 1
  },
  footer: {
    borderTopColor: '#f0f0f0',
    borderTopWidth: 0.5,
    marginHorizontal: 25
  },
  plansSection: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    height: 350,
  },
  plansScrollView: {
    height: 300,
  },
  plansTitle: {
    color: '#ffffff',
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  planCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: theme.spacing.md,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
    fontStyle: 'italic',
    flexBasis: '33%'
  },
  planSpeed: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
    marginTop: 2,
  },
  planPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  planMbps: {
    fontWeight: theme.fontWeight.normal,
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryDark
  },
  planDetails: {
    gap: theme.spacing.sm,
  },
  planCode: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  extraItem: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  extraName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  extraApp: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
  },
  contractButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: theme.fontSize.md,
  },
});
