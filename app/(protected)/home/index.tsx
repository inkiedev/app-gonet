import Menu from '@/assets/images/iconos gonet app menu.svg';
import Beneficios from '@/assets/images/iconos gonet app svg_beneficios.svg';
import Servicios from '@/assets/images/iconos gonet app svg_gonetBlack.svg';
import Mensaje from '@/assets/images/iconos gonet app svg_mensaje.svg';
import Pagos from '@/assets/images/iconos gonet app svg_Pagos.svg';
import Soporte from '@/assets/images/iconos gonet app svg_Soporte.svg';
import { HomeExpandableCard } from '@/components/app/home-expandable-card';
import { IconWithBadge } from '@/components/app/icon-with-badge';
import { SideMenu } from '@/components/app/side-menu';
import { Header } from '@/components/layout/header';
import Text from '@/components/ui/custom-text';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { NotificationsModal, type Notification } from '@/components/ui/notifications-modal';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { useNotificationContext } from '@/contexts/notification-context';
import { useTheme } from '@/contexts/theme-context';
import { useResponsive } from '@/hooks/use-responsive';
import { authService } from '@/services/auth';
import { RootState } from '@/store';
import { loadSubscriptionsData, logout, selectAccount } from '@/store/slices/auth-slice';
import { formatGoWord } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Pago procesado exitosamente',
    message: 'Tu pago de $25.50 ha sido procesado correctamente. El servicio se activará en los próximos minutos.',
    type: 'success',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    title: 'Nueva promoción disponible',
    message: '¡Aprovecha 20% de descuento en todos nuestros planes hasta fin de mes!',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: '3',
    title: 'Mantenimiento programado',
    message: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 6:00 AM. Disculpa las molestias.',
    type: 'warning',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: '4',
    title: 'Factura disponible',
    message: 'Tu factura del mes de enero ya está disponible para descarga en la sección de pagos.',
    type: 'info',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
  {
    id: '5',
    title: 'Velocidad mejorada',
    message: 'Hemos mejorado tu velocidad de internet. Ahora disfrutas de hasta 1000 Mbps.',
    type: 'success',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    read: true,
  },
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const opacity = useSharedValue(1);
  const heightAnimation = useSharedValue(60);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { currentAccount, subscriptions: storeSubscriptions, selectedAccountIndex } = useSelector((state: RootState) => state.auth);
  
  // ========== MOCK PARA TESTING - REMOVER EN PRODUCCIÓN ==========
  const mockSubscriptions = storeSubscriptions.length > 0 ? [
    ...storeSubscriptions,
    {
      ...storeSubscriptions[0],
      id: 'mock-account-demo-home',
      partner: {
        ...storeSubscriptions[0].partner,
        name: 'EMPRESA DEMO S.A.',
        dni: '0987654321001',
        street: 'Av. Demo 123',
      },
      plan: [{
        ...storeSubscriptions[0].plan[0],
        name: 'GoNet Pro 1000',
      }],
      residual: '45.99',
    }
  ] : storeSubscriptions;
  const subscriptions = mockSubscriptions;
  // ============== FIN DEL MOCK - REMOVER HASTA AQUÍ ==============
  
  const { showSuccess, showError } = useNotificationContext();
  const { toggleExpansion } = useCardExpansion();
  const { height } = useResponsive();
  const { theme } = useTheme();
  const styles = createDynamicStyles(theme);


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
      if (!currentAccount && subscriptions.length === 0) {
        dispatch(loadSubscriptionsData() as any);
      }
    }, [dispatch, currentAccount, subscriptions.length]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleCardToggle = (expanded: boolean) => {
    toggleExpansion();
    opacity.value = withTiming(expanded ? 0 : 1, { duration: 500 });
    heightAnimation.value = withTiming(expanded ? 0 : 60, { duration: 500 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      height: heightAnimation.value,
    };
  });

  const handleMenuNavigation = (item: string) => {
    const routeMap: { [key: string]: string } = {
      'Perfil': '/(protected)/home/perfil',
      'Configuracion App': '/(protected)/home/ajustes',
      'Agencias': '/(protected)/home/agencias',
      'Consulta Pagos': '/(protected)/home/pagos',
      'Seguridad': '/(protected)/home/soporte',
      'Adquiere mas': '/(protected)/home/servicios',
      'Beneficios GoNet': '/(protected)/home/goclub',
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
      
      showSuccess(
        '¡Hasta pronto!',
        'Tu sesión ha sido cerrada correctamente.',
        3000
      );
      
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

  const handleNotificationsPress = () => {
    setNotificationsVisible(true);
  };

  const handleNotificationPress = (notification: Notification) => {
    showSuccess(
      'Notificación seleccionada',
      notification.title,
      2000
    );
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleAccountSelectorPress = () => {
    if (subscriptions.length > 1) {
      setAccountSelectorVisible(true);
    }
  };

  const handleAccountChange = (accountIndex: number) => {
    dispatch(selectAccount(accountIndex));
    setAccountSelectorVisible(false);
    showSuccess(
      'Cuenta cambiada',
      `Ahora usando: ${subscriptions[accountIndex].partner.name}`,
      2000
    );
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.bannerContainer}>
        <ImageCarousel
          style={styles.banner}
          height={height * 0.55}
        />
        <Header
          leftAction={
            subscriptions.length > 1 ? {
              icon: (
                <View style={styles.accountBadgeContainer}>
                  <Ionicons 
                    name="people-outline" 
                    size={24} 
                    color={theme.colors.text.primary}
                  />
                  <View style={styles.accountBadge}>
                    <Text style={styles.accountBadgeText}>
                      {subscriptions.length}
                    </Text>
                  </View>
                </View>
              ),
              onPress: handleAccountSelectorPress,
            } : undefined
          }
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

        <Animated.View style={[styles.iconsGrid, animatedStyle]}>
          {iconOptions.map((option, index) => (
            <IconWithBadge
              key={index}
              size={55}
              SvgComponent={option.SvgComponent}
              label={option.label}
              badgeCount={option.label === 'Mensajes' ? unreadCount : option.badgeCount}
              onPress={() => {
                if (option.label === 'Mensajes') {
                  handleNotificationsPress();
                } else {
                  showSuccess(
                    '¡Bienvenido!',
                    `Presionaste ${option.label}`,
                    2000
                  );
                }
              }}
            />
          ))}
        </Animated.View>

        <NotificationsModal
          visible={notificationsVisible}
          onClose={() => setNotificationsVisible(false)}
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
          onMarkAsRead={handleMarkAsRead}
        />

        {/* Account Selector Modal */}
        <Modal
          visible={accountSelectorVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAccountSelectorVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setAccountSelectorVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.accountModal}>
                  <Text style={styles.accountModalTitle}>Seleccionar Cuenta</Text>
                  {subscriptions.map((account, index) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountModalItem,
                        index === selectedAccountIndex && styles.accountModalItemSelected
                      ]}
                      onPress={() => handleAccountChange(index)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.accountModalItemContent}>
                        <Text style={[
                          styles.accountModalItemName,
                          index === selectedAccountIndex && styles.accountModalItemNameSelected
                        ]}>
                          {account.partner.name}
                        </Text>
                        <Text style={[
                          styles.accountModalItemPlan,
                          index === selectedAccountIndex && styles.accountModalItemPlanSelected
                        ]}>
                          {formatGoWord(account.plan[0]?.name)} - ${account.residual} pendiente
                        </Text>
                      </View>
                      {index === selectedAccountIndex && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
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
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl
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
  },
  planCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 700,
  },
  iconsGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 700
  },
  accountBadgeContainer: {
    position: 'relative',
  },
  accountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  accountBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    maxHeight: '70%',
    minWidth: 300,
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  accountModalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  accountModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  accountModalItemSelected: {
    backgroundColor: theme.colors.primary + '15',
  },
  accountModalItemContent: {
    flex: 1,
  },
  accountModalItemName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  accountModalItemNameSelected: {
    color: theme.colors.primary,
  },
  accountModalItemPlan: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  accountModalItemPlanSelected: {
    color: theme.colors.primary,
  },
});
