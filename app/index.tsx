import NewUser from '@/assets/icons/new-user.svg';
import Register from '@/assets/icons/register.svg';
import User from '@/assets/icons/user.svg';
import AppLogo from '@/assets/images/iconos gonet app svg_GoneetLogo.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
import MaskedBadge from '@/components/app/masked-badge';
import { Footer } from "@/components/layout/footer";
import Text from '@/components/ui/custom-text';
import { ImageCarousel } from "@/components/ui/image-carousel";
import { useNotificationContext } from "@/contexts/notification-context";
import { useTheme } from "@/contexts/theme-context";
import { useResponsive } from "@/hooks/use-responsive";
import { useAuthRoute } from "@/providers/auth-route-provider";
import { RootState } from "@/store";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { ImageBackground, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
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
  },
  {
    SvgComponent: <NewUser width={SVG_SIZE} height={SVG_SIZE} />,
    label: '¿Quieres formar parte de GoNet?',
  }
];

export default function PublicHomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isInitialized } = useAuthRoute();
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const { showSuccess, showError } = useNotificationContext();
  const { height, isTablet } = useResponsive();
  
  if (!isInitialized) {
    return null; 
  }

  if (isAuthenticated && !needsBiometricVerification) {
    return <Redirect href="/(protected)/home" />;
  }

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleBadgePress = (index: number) => {
    // Rutas que podrás configurar después
    const routes = [
      '/soporte',
      '/login', 
      '/register',
      '/hola',
    ];
    
    router.push(routes[index])
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
        <View style={styles.bannerContainer}>
          <ImageCarousel
            style={styles.banner}
            height={height * 0.55}
          />
        </View>
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  options: {
    width: '100%',
    maxWidth: 800,
    marginTop: 100,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '95%',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
    fontSize: theme.fontSize.xs * 0.7,
    wordWrap: 'wrap',
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    padding: theme.spacing.xs,
    paddingTop: 10
  },
  maskedBadge: {
    
  },
  iconContainer: {
    width: '25%',
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
  logo: {
    position: 'absolute',
    top: -50
  },
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
  }
});
