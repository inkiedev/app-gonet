import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons, Entypo, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';

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
}

const menuItems: MenuItem[] = [
  {
    icon: <FontAwesome name="user" size={24} color={theme.colors.text.inverse} />,
    label: 'Perfil',
  },
  {
    icon: <FontAwesome name="cog" size={24} color={theme.colors.text.inverse} />,
    label: 'Configuración App',
  },
  {
    icon: <MaterialIcons name="local-mall" size={24} color={theme.colors.text.inverse} />,
    label: 'Agencias',
  },
  {
    icon: <Entypo name="wallet" size={24} color={theme.colors.text.inverse} />,
    label: 'Consulta Pagos',
  },
  {
    icon: <MaterialIcons name="security" size={24} color={theme.colors.text.inverse} />,
    label: 'Seguridad',
  },
  {
    icon: <Feather name="shopping-cart" size={24} color={theme.colors.text.inverse} />,
    label: 'Adquiere más',
  },
  {
    icon: <MaterialCommunityIcons name="logout-variant" size={24} color={theme.colors.text.inverse} />,
    label: 'Cerrar Sesión',
  },
];

export const SideMenu: React.FC<SideMenuProps> = ({
                                                    visible,
                                                    onClose,
                                                    onItemPress,
                                                    testID,
                                                  }) => {
  const slideAnim = React.useRef(new Animated.Value(-screenWidth * 0.6)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsAnimating(true);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    } else if (shouldRender) {
      setIsAnimating(true);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
        setIsAnimating(false);
      });
    }
  }, [visible, slideAnim, opacityAnim, shouldRender]);

  if (!shouldRender && !isAnimating) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        style={[styles.overlay, { opacity: opacityAnim }]}
        testID={testID}
      >
        <SafeAreaView style={styles.container}>
          <Animated.View
            style={[
              styles.menu,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.menuContent}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => onItemPress(item.label)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>{item.icon}</View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
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

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  container: {
    flex: 1,
  },
  menu: {
    width: screenWidth * 0.6,
    height: screenHeight,
    backgroundColor: theme.colors.primaryDark,
    paddingTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    borderTopRightRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  menuContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  menuItemIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.medium,
  },
});
