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
import { Card } from '@/components/ui/card';
import Text from '@/components/ui/custom-text';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { NotificationsModal, type Notification } from '@/components/ui/notifications-modal';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';


const iconOptions = [
  {
    SvgComponent: Mensaje,
    label: 'Mensajes',
    badgeCount: 2,
    action: 'notifications'
  },
  {
    SvgComponent: Pagos,
    label: 'Pagos',
    action: 'navigate',
    route: '/(protected)/home/pagos'
  },
  {
    SvgComponent: Servicios,
    label: '+Servicios',
    badgeCount: '+',
    action: 'message',
    message: { title: '¡Próximamente!', content: 'Nuevos servicios estarán disponibles pronto' }
  },
  {
    SvgComponent: Soporte,
    label: 'Soporte',
    action: 'navigate',
    route: '/(protected)/home/soporte'
  },
  {
    SvgComponent: Beneficios,
    label: 'Beneficios',
    action: 'navigate',
    route: '/(protected)/home/beneficios'
  },
];

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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { currentAccount, subscriptions, selectedAccountIndex } = useSelector((state: RootState) => state.auth);
  
  const { showSuccess, showError } = useNotificationContext();
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

  // Función para abrir el modal
  const openCardModal = () => {
    setCardModalVisible(true);
  };

  const closeCardModal = () => {
    setCardModalVisible(false);
  };

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


  const unreadCount = notifications.filter(n => !n.read).length;

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

  const handleIconPress = (option: any) => {
    switch (option.action) {
      case 'notifications':
        handleNotificationsPress();
        break;
      case 'navigate':
        if (option.route) {
          router.push(option.route);
        }
        break;
      case 'message':
        if (option.message) {
          showSuccess(
            option.message.title,
            option.message.content,
            2000
          );
        }
        break;
      default:
        showSuccess(
          '¡Bienvenido!',
          `Presionaste ${option.label}`,
          2000
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.bannerContainer}>
        <ImageCarousel
          style={styles.banner}
          height={height * 0.5}
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
          handleMenuNavigation(item);
          closeMenu();
        }}
        onLogout={handleLogout}
      />

      <View style={styles.content}>
        {/* Account Selector */}
        {subscriptions.length > 0 && (
          <View style={{ paddingHorizontal: theme.spacing.md, width: '100%' }}>
          <TouchableOpacity 
            onPress={handleAccountSelectorPress}
            style={styles.accountSelector}
            activeOpacity={0.7}
            disabled={subscriptions.length <= 1}
          >
            <View style={styles.accountSelectorContent}>
              <View style={styles.accountInfo}>
                <Ionicons 
                  name="person-circle" 
                  size={24} 
                  color={theme.colors.primaryDark} 
                />
                <View style={styles.accountDetails}>
                  <Text style={styles.accountLabel}>Cuenta activa</Text>
                  <Text style={styles.accountName} numberOfLines={1}>
                    {currentAccount?.partner.name || 'Seleccionar cuenta'}
                  </Text>
                </View>
              </View>
              {subscriptions.length > 1 && (
                <View style={styles.accountActions}>
                  <View style={styles.accountBadge}>
                    <Text style={styles.accountBadgeText}>{subscriptions.length}</Text>
                  </View>
                  <Ionicons 
                    name="chevron-down" 
                    size={18} 
                    color={theme.colors.primaryDark} 
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
          </View>
        )}
        
        <HomeExpandableCard
          plan="GoNet"
          speed={750}
          style={styles.planCard}
          onDetailsPress={openCardModal}
        />

        <View style={styles.iconsGrid}>
          {iconOptions.map((option, index) => (
            <IconWithBadge
              key={index}
              size={55}
              SvgComponent={option.SvgComponent}
              label={option.label}
              badgeCount={option.label === 'Mensajes' ? unreadCount : option.badgeCount}
              onPress={() => handleIconPress(option)}
            />
          ))}
        </View>

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

      {/* Card Modal Overlay */}
      <Modal
        visible={cardModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCardModal}
      >
        <View style={styles.detailsModalOverlay}>
          <TouchableWithoutFeedback onPress={closeCardModal}>
            <View style={styles.detailsModalBackground} />
          </TouchableWithoutFeedback>
          
          <View style={styles.detailsModalCard}>
            <Card style={styles.detailsCard} variant="elevated">
              <View style={styles.modalCardHeader}>
                <Text style={styles.clientName}>
                  {currentAccount?.partner.name}
                </Text>
                <Text style={styles.planName}>
                  {formatGoWord(currentAccount?.plan[0]?.name)}
                </Text>
                <View style={styles.speedContainer}>
                  <Text style={styles.speedNumber}>
                    {currentAccount?.plan[0]?.name.match(/\d+/)}
                  </Text>
                  <Text style={styles.speedUnit}>Mbps</Text>
                </View>
              </View>
              
              {/* Detalles del plan */}
              <View style={styles.detailsContent}>
                <View style={styles.detailItem}>
                  <Servicios width={24} height={24} color={theme.colors.primaryDark} />
                  <Text style={styles.detailLabel}>
                    Lite Tv Streaming
                  </Text>
                  <Text style={styles.detailValue}>
                    1 pantalla
                  </Text>
                  <View style={[styles.upgradeIcon, { backgroundColor: theme.colors.success }]}>
                    <Text style={styles.upgradeText}>+</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Soporte width={24} height={24} color={theme.colors.primaryDark} />
                  <Text style={styles.detailLabel}>
                    Wifi Total
                  </Text>
                  <Text style={styles.detailValue}>
                    Wifi6
                  </Text>
                  <View style={[styles.upgradeIcon, { backgroundColor: theme.colors.success }]}>
                    <Text style={styles.upgradeText}>+</Text>
                  </View>
                </View>
                
                <View style={styles.addServices}>
                  <View style={[styles.addIcon, { backgroundColor: theme.colors.secondary }]}>
                    <Text style={styles.addText}>+</Text>
                  </View>
                  <Text style={styles.addServiceLabel}>
                    Agrega mas servicios
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </Modal>
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
    gap: theme.spacing.sm + 4,
  },
  planCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 700,
    paddingHorizontal: theme.spacing.md
  },
  iconsGrid: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 700,
  },
  detailsModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    zIndex: 1001,
  },
  expandedCardStyle: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.lg,
  },
  detailsModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  detailsModalCard: {
    width: '90%',
    maxWidth: 400,
    zIndex: 1001,
  },
  detailsCard: {
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.lg,
  },
  modalCardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  notificationIcon: {
    padding: theme.spacing.xs,
  },
  clientName: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '25%',
    color: theme.colors.primaryDark,
  },
  planName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    color: theme.colors.primaryDark,
  },
  speedContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  speedNumber: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    color: theme.colors.primaryDark,
  },
  speedUnit: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primaryDark,
  },
  detailsContent: {
    width: '100%',
  },
  detailItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  detailLabel: {
    fontSize: theme.fontSize.xs,
    maxWidth: theme.spacing.xxl * 2,
    textAlign: 'center',
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  detailValue: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  upgradeIcon: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs * 0.8,
    fontWeight: theme.fontWeight.bold,
  },
  addServices: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  addIcon: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs * 0.8,
    fontWeight: theme.fontWeight.bold,
  },
  addServiceLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  accountSelector: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  accountSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  accountDetails: {
    flex: 1,
  },
  accountLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs / 2,
  },
  accountName: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  accountBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  accountBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
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
    backgroundColor: theme.colors.primary + '30',
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
    color: theme.colors.primaryDark,
  },
  accountModalItemPlan: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  accountModalItemPlanSelected: {
    color: theme.colors.primaryDark,
  },
});
