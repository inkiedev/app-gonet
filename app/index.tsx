import Register from '@/assets/icons/register.svg';
import User from '@/assets/icons/user.svg';
import AppLogo from '@/assets/images/iconos gonet app svg_GoneetLogo.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
import LogoContactanos from '@/assets/images/icons/messages-square.svg';
import MaskedBadge from '@/components/app/masked-badge';
import { Footer } from "@/components/layout/footer";
import { Button } from '@/components/ui/custom-button';
import Text from '@/components/ui/custom-text';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { useNotificationContext } from "@/contexts/notification-context";
import { useTheme } from "@/contexts/theme-context";
import { useResponsive } from "@/hooks/use-responsive";
import { useAuthRoute } from "@/providers/auth-route-provider";
import { getPromotionById, getPromotions, Promotion, PromotionDetail } from '@/services/public-api';
import { RootState } from "@/store";
import { formatGoWord } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const SVG_SIZE = 30;
const ventanaNuevoPromocion = 70; // Días para considerar una promoción como nueva

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
  const { height: ScreenHeight } = useResponsive() 
  const router = useRouter();
  const { theme } = useTheme();
  const { isInitialized } = useAuthRoute();
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<Promotion[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const isSomePlanExpanded = Object.values(expandedPlans).some(isExpanded => isExpanded);
  const [promotionDetails, setPromotionDetails] = useState<Record<string, PromotionDetail | null>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const { showError } = useNotificationContext();
  const { isTablet } = useResponsive();

  const isNewPromotion = (createDate: string): boolean => {
    const promotionDate = new Date(createDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - promotionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= ventanaNuevoPromocion;
  };
  
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

  const handleToggle = async (planId: number, expanded: boolean) => {
    setExpandedPlans((prev) => ({ ...prev, [planId]: expanded }));
    if (expanded && !promotionDetails[planId]) {
      setLoadingDetails((prev) => ({ ...prev, [planId]: true }));
      try {
        const details = await getPromotionById(planId);
        setPromotionDetails((prev) => ({ ...prev, [planId]: details }));
      } catch (error) {
        console.error('Error loading promotion details:', error);
        showError('Error', 'No se pudieron cargar los detalles de la promoción');
        setPromotionDetails((prev) => ({ ...prev, [planId]: null }));
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [planId]: false }));
      }
    }
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
  const handleContact = () =>{
    console.log("lógica para el contacto con nosotros")
  }
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
          <AppLogo style={styles.logo} width={ScreenHeight*0.15} height={ScreenHeight*0.15} />
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
                    size={ScreenHeight*0.06}
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
                plans.map((plan) => {
                  const isNew = isNewPromotion(plan.create_date);
                  const hasGradient = plan.extras.length > 2;

                  const card = (
                    <ExpandableCard
                      key={plan.id}
                      onToggle={(expanded) => handleToggle(plan.id, expanded)}
                      renderHeader={() => (
                        <View style={styles.planCardContent}>
                          <View style={styles.planHeader}>
                            <View style={styles.planNameContainer}>
                              <Text style={[styles.planName, hasGradient && styles.planNameWhite]}>{formatGoWord(plan.name)}</Text>
                              <Text style={[styles.detailsText, hasGradient && styles.detailsTextWhite]}>
                                {expandedPlans[plan.id] ? 'Ocultar detalles' : 'Ver detalles'}
                              </Text>
                            </View>
                            <View style={styles.planSpeedContainer}><Text style={[styles.planSpeed, hasGradient && styles.planSpeedWhite]}>{(plan["speed:_download"] / 1000).toFixed(0)}</Text><Text style={[styles.planMbps, hasGradient && styles.planMbpsWhite]}>Mbps</Text></View>
                            <Text style={[styles.planPrice, hasGradient && styles.planPriceWhite]}>${plan.total.toFixed(2)}+imp</Text>
                          </View>
                          {isNew && (
                            <View style={styles.newLabelContainer}>
                              <Text style={styles.newLabelText}>Nuevo!</Text>
                            </View>
                          )}
                        </View>
                      )}
                      style={styles.planCard}
                      icon={
                        <Ionicons 
                          name="wifi" 
                          size={24} 
                          color={hasGradient ? '#fff' : theme.colors.primary} 
                        />
                      }
                      backgroundComponent={hasGradient ? 
                        <LinearGradient
                          colors={['#e02373', '#6c3b8d']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={StyleSheet.absoluteFill}
                        /> : undefined
                      }
                    >
                      <View style={[styles.planDetails, styles.planCardContent]}>
                        {loadingDetails[plan.id] && <Text>Cargando...</Text>}
                        {promotionDetails[plan.id] && (
                          <View>
                            <View style={[styles.detailsSeparator, hasGradient && styles.detailsSeparatorWhite]} />
                            {[ 
                              { label: 'Tipo de enlace', value: promotionDetails[plan.id]?.link_type },
                              { label: 'Nivel de compartición', value: promotionDetails[plan.id]?.sharing_level },
                              { label: 'Tipo de conexión', value: promotionDetails[plan.id]?.connection_type },
                              { label: 'Velocidad de subida', value: `${promotionDetails[plan.id]?.['speed:_upload']} ${promotionDetails[plan.id]?.speed_type_up}` },
                              { label: 'Velocidad de bajada', value: `${promotionDetails[plan.id]?.['speed:_download']} ${promotionDetails[plan.id]?.speed_type_down}` },
                            ].map((item, index) => (
                              <View key={index} style={styles.detailItemContainer}>
                                <View style={[styles.bullet, hasGradient && styles.bulletWhite]} />
                                <Text style={[styles.detailItemText, hasGradient && styles.detailItemTextWhite]}>{`${item.label}: ${item.value}`}</Text>
                              </View>
                            ))}
                            <Button
                              title="Contrata Aquí"
                              onPress={handleLogin}
                              size="md"
                              style={styles.detailsContractButton}
                              variant={hasGradient ? 'secondary' : 'primary'}
                            />
                          </View>
                        )}
                        {!loadingDetails[plan.id] && !promotionDetails[plan.id] && expandedPlans[plan.id] && (
                            <Text>No se pudieron cargar los detalles.</Text>
                        )}
                      </View>
                    </ExpandableCard>
                  );

                  if (hasGradient) {
                    return card;
                  }

                  return <View key={plan.id}>{card}</View>;
                })
              )}
            </ScrollView>
          </View>

          {!isSomePlanExpanded &&
            <Animated.View exiting={FadeOutDown.duration(300)} entering={FadeInUp.duration(300)}>
          <TouchableOpacity style = {styles.contractButton} onPress={handleContact}>
              <LogoContactanos width={50} height={50} color={'#fff'}/>
              <Text style={[styles.badgeText, isTablet && { fontSize: theme.fontSize.xs  }]}>
                Contáctate con nosotros
                </Text>
          </TouchableOpacity>
          </Animated.View>}
        </View>
        
        <Footer style={styles.footer} variant='transparent' />
      </ImageBackground>
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  },
  logo: {
    marginTop: 15,
    
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
    flex: 1,
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  plansScrollView: {
    flex: 1,
  },
  plansTitle: {
    color: '#ffffff',
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
    paddingBottom: theme.spacing.sm,
  },
  planCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  planCardContent: {
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
    color: '#07827cff',
    fontStyle: 'italic',
  },
  planNameWhite: {
    color: '#fff',
  },
  planSpeed: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
    marginTop: 2,
  },
  planSpeedWhite: {
    color: '#fff',
  },
  planPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  planPriceWhite: {
    color: '#fff',
  },
  planMbps: {
    fontWeight: theme.fontWeight.normal,
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryDark
  },
  planMbpsWhite: {
    color: '#fff',
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
    flexDirection: "row",
    alignItems: "center",
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
  planNameContainer: {
    flexBasis: '33%',
  },
  detailsText: {
    textDecorationLine: 'underline',
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.sm,
  },
  detailsTextWhite: {
    color: '#fff',
  },
  planSpeedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsSeparator: {
    height: 1,
    backgroundColor: theme.colors.primaryDark,
    marginBottom: theme.spacing.md,
  },
  detailsSeparatorWhite: {
    backgroundColor: '#fff',
  },
  detailItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  bulletWhite: {
    backgroundColor: '#fff',
  },
  detailItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryDark,
  },
  detailItemTextWhite: {
    color: '#fff',
  },
  detailsContractButton: {
    marginTop: theme.spacing.md,
  },
  newLabelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  newLabelText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.xs,
  },
});