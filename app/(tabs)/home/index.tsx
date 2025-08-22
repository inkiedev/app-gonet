import Servicios from '@/assets/images/iconos gonet app svg_gonetBlack.svg';
import Mensaje from '@/assets/images/iconos gonet app svg_mensaje.svg';
import Pagos from '@/assets/images/iconos gonet app svg_Pagos.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
import { HomeExpandableCard } from '@/components/app/home-expandable-card';
import { IconWithBadge } from '@/components/app/icon-with-badge';
import { SideMenu } from '@/components/app/side-menu';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/layout/header';
import { authService } from '@/services/auth';
import { logout, loadUserData } from '@/store/slices/auth-slice';
import { theme } from '@/styles/theme';
import { RootState } from '@/store';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, Text, View } from 'react-native';
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
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.auth);

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
    setIsCardExpanded(expanded);
    Animated.timing(fadeAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
      await authService.logout();
      dispatch(logout());
      
      // Now should redirect properly to main index
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <Header
          leftAction={{
            icon: 'menu',
            onPress: toggleMenu,
          }}
          centerContent={
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData?.name || 'Usuario'}</Text>
            </View>
          }
          rightAction={{
            icon: 'person',
            onPress: handleProfilePress,
          }}
          variant="transparent"
        />

        <View style={styles.content}>
          <HomeExpandableCard
            plan="GoNet"
            speed={750}
            style={styles.planCard}
            onToggle={handleCardToggle}
          />

          <Animated.View style={[styles.iconsGrid, { opacity: fadeAnim }]}>
            {iconOptions.map((option, index) => (
              <IconWithBadge
                key={index}
                size={80}
                SvgComponent={option.SvgComponent}
                label={option.label}
                badgeCount={option.badgeCount}
                onPress={() => console.log(`press ${option.label}`)}
              />
            ))}
          </Animated.View>
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
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.md,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingHorizontal: theme.spacing.xl,
  },
  planCard: {
    alignSelf: 'center',
    marginVertical: theme.spacing.lg,
  },
  iconsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
