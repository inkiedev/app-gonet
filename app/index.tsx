import Beneficios from '@/assets/images/iconos gonet app svg_beneficios.svg';
import AppLogo from '@/assets/images/iconos gonet app svg_GoneetLogo.svg';
import Servicios from '@/assets/images/iconos gonet app svg_gonetBlack.svg';
import Mensaje from '@/assets/images/iconos gonet app svg_mensaje.svg';
import Pagos from '@/assets/images/iconos gonet app svg_Pagos.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
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
import { ImageBackground, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";


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

export default function PublicHomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isInitialized } = useAuthRoute();
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const { showSuccess, showError } = useNotificationContext();
  const { height } = useResponsive();
  
  if (!isInitialized) {
    return null; 
  }

  if (isAuthenticated && !needsBiometricVerification) {
    return <Redirect href="/(protected)/home" />;
  }

  const handleLogin = () => {
    router.push("/(auth)/login");
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
            <View style={styles.iconsGrid}>

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
    paddingHorizontal: 16,
    gap: 16,
    position: 'relative',
  },
  options: {
    marginTop: 100,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconsGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 700
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
