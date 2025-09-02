import Location from '@/assets/images/iconos gonet agencias.svg';
import Gift from '@/assets/images/iconos gonet beneficios.svg';
import Cart from '@/assets/images/iconos gonet cart.svg';
import Logout from '@/assets/images/iconos gonet logout.svg';
import Perfil from '@/assets/images/iconos gonet profile.svg';
import Security from '@/assets/images/iconos gonet security.svg';
import Settings from '@/assets/images/iconos gonet settings.svg';
import Wallet from '@/assets/images/iconos gonet wallet.svg';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

interface SideMenuProps extends BaseComponentProps {
  visible: boolean;
  onClose: () => void;
  onItemPress: (item: string) => void;
  onLogout?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, onItemPress, onLogout, testID }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const MENU_COLOR = theme.colors.text.primary;
  
  const menuItems: MenuItem[] = [
    { icon: <Perfil color={MENU_COLOR} />, label: 'Perfil' },
    { icon: <Settings color={MENU_COLOR} />, label: 'Configuracion App' },
    { icon: <Location color={MENU_COLOR} />, label: 'Agencias' },
    { icon: <Wallet color={MENU_COLOR} />, label: 'Consulta Pagos' },
    { icon: <Security color={MENU_COLOR} />, label: 'Seguridad' },
    { icon: <Cart color={MENU_COLOR} />, label: 'Adquiere mas' },
    { icon: <Gift color={MENU_COLOR} />, label: 'Beneficios GoNet' },
    { icon: <Logout color={MENU_COLOR} />, label: 'Cerrar Sesión' },
  ];
  
  const slideAnim = useSharedValue(screenWidth * 0.6);
  const opacityAnim = useSharedValue(0);
  const [shouldRender, setShouldRender] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      opacityAnim.value = withTiming(1, { duration: 300 });
      slideAnim.value = withTiming(0, { duration: 300 });
    } else {
      opacityAnim.value = withTiming(0, { duration: 300 });
      slideAnim.value = withTiming(screenWidth * 0.6, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [visible, opacityAnim, slideAnim]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  if (!shouldRender) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View style={[dynamicStyles.overlay, overlayAnimatedStyle]} testID={testID}>
        <SafeAreaView style={dynamicStyles.container}>
          <Animated.View style={[dynamicStyles.menu, menuAnimatedStyle]}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.menuContent}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.label ?? index}
                    style={dynamicStyles.menuItem}
                    onPress={() => {
                      if (item.label === 'Cerrar Sesión' && onLogout) {
                        onLogout();
                      } else {
                        onItemPress(item.label);
                      }
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={dynamicStyles.menuItemIcon}>{item.icon}</View>
                    <Text style={dynamicStyles.menuItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  container: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  menu: {
    width: screenWidth * 0.65,
    height: screenHeight,
    backgroundColor: theme.colors.text.inverse,
    paddingTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  menuContent: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  menuItemIcon: { width: 32, alignItems: 'center', marginRight: theme.spacing.md },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.medium,
  },
});
