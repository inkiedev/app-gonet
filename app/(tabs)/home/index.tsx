import Menu from '@/assets/images/iconos gonet app menu.svg';
import Beneficios from '@/assets/images/iconos gonet app svg_beneficios.svg';
import Servicios from '@/assets/images/iconos gonet app svg_gonetBlack.svg';
import Mensaje from '@/assets/images/iconos gonet app svg_mensaje.svg';
import Pagos from '@/assets/images/iconos gonet app svg_Pagos.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
import { HomeExpandableCard } from '@/components/app/home-expandable-card';
import { IconWithBadge } from '@/components/app/icon-with-badge';
import { SideMenu } from '@/components/app/side-menu';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/layout/header';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { useNotificationContext } from '@/contexts/notification-context';
import { useResponsive } from '@/hooks/use-responsive';
import { authService } from '@/services/auth';
import { RootState } from '@/store';
import { loadUserData, logout } from '@/store/slices/auth-slice';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';


const iconOptions = [
  {
    SvgComponent: Mensaje,
    label: 'Mensajes',
    badgeCount: 2,
  },
  {
    SvgComponent: Pagos,
    label: 'Pagos',
  },
  {
    SvgComponent: Servicios,
    label: '+Servicios',
    badgeCount: '+',
  },
  {
    SvgComponent: Soporte,
    label: 'Soporte',
  },
  {
    SvgComponent: Beneficios,
    label: 'Beneficios',
  },
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { showSuccess, showError, showInfo } = useNotificationContext();
  const { toggleExpansion } = useCardExpansion();
  const [iconsVisible, setIconsVisible] = useState(true);
  const { height } = useResponsive();

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (!userData) {
      dispatch(loadUserData() as any);
    }
  }, [dispatch, userData]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleProfilePress = () => {
    router.push('/home/perfil');
  };

  const handleCardToggle = (expanded: boolean) => {
    toggleExpansion();
    setIconsVisible(!iconsVisible);
  };

  const handleMenuNavigation = (item: string) => {
    const routeMap: { [key: string]: string } = {
      'Ajustes': '/home/ajustes',
      'Agencias': '/home/agencias',
      'Pagos': '/home/pagos',
      'Soporte': '/home/soporte',
      'Servicios': '/home/servicios',
      'Promociones': '/home/promociones',
      'Go Club': '/home/goclub',
      'Calificanos': '/home/calificanos',
      'Mi Plan': '/home/planes',
    };

    const route = routeMap[item];
    if (route) {
      router.push(route as any);
    }
  };

  const handleLogout = async () => {
    try {
      showInfo(
        'Cerrando sesión...',
        'Un momento, estamos cerrando tu sesión de forma segura.',
        2000
      );
      
      await authService.logout();
      dispatch(logout());
      
      showSuccess(
        '¡Hasta pronto!',
        'Tu sesión ha sido cerrada correctamente.',
        3000
      );
      
      // Now should redirect properly to main index
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
      showError(
        'Error al cerrar sesión',
        'Hubo un problema cerrando tu sesión. Por seguridad, serás redirigido al login.',
        4000
      );
      router.replace('/');
    }
  };


  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <View style={styles.bannerContainer}>
          <ImageCarousel
            style={styles.banner}
            height={height * 0.55}
          />
          <Header
            rightAction={{
              icon: <Menu width={24} height={24} fill={theme.colors.primary} />,
              onPress: toggleMenu,
            }}
            variant="transparent"
            style={styles.fixedHeader}
          />
        </View>

        <SideMenu
          visible={menuVisible}
          onClose={closeMenu}
          onItemPress={(item: string) => {
            console.log(`Menu item pressed: ${item}`);
            handleMenuNavigation(item);
            closeMenu();
          }}
          onLogout={handleLogout}
        />

        <View style={styles.content}>
          <HomeExpandableCard
            plan="GoNet"
            speed={750}
            style={styles.planCard}
            onToggle={handleCardToggle}
          />

          {
            iconsVisible &&  (
              <Animated.View style={styles.iconsGrid} entering={FadeInDown} exiting={FadeOutDown} >
                {iconOptions.map((option, index) => (
                  <IconWithBadge
                    key={index}
                    size={60}
                    SvgComponent={option.SvgComponent}
                    label={option.label}
                    badgeCount={option.badgeCount}
                    onPress={() => console.log(`press ${option.label}`)}
                  />
                ))}
              </Animated.View>
            )
          }
        </View>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    gap: theme.spacing.md,
  },
  planCard: {
    alignSelf: 'center',
    width: '100%'
  },
  iconsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
