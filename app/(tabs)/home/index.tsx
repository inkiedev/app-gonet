import { FontAwesome6, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeExpandableCard } from '@/components/app/home-expandable-card';
import { IconWithBadge } from '@/components/app/icon-with-badge';
import { SideMenu } from '@/components/app/side-menu';
import { Header } from '@/components/layout/header';
import { theme } from '@/styles/theme';

const mockUser = {
  firstName: 'Juan',
  lastName: 'Gonzales',
  plan: 'GoPlus',
  speed: 750,
};

const iconOptions = [
  {
    IconComponent: SimpleLineIcons,
    name: 'envelope',
    label: 'Mensajes',
    badgeCount: 2,
  },
  {
    IconComponent: FontAwesome6,
    name: 'hand-holding-dollar',
    label: 'Pagos',
  },
  {
    IconComponent: Ionicons,
    name: 'logo-apple',
    label: '+Servicios',
    badgeCount: '+',
  },
  {
    IconComponent: MaterialIcons,
    name: 'contact-support',
    label: 'Soporte',
  },
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleProfilePress = () => {
    router.push('/home/ajustes');
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftAction={{
          icon: 'menu',
          onPress: toggleMenu,
        }}
        centerContent={
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{mockUser.firstName}</Text>
            <Text style={styles.userName}>{mockUser.lastName}</Text>
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
          plan={mockUser.plan}
          speed={mockUser.speed}
          style={styles.planCard}
        />

        <View style={styles.iconsGrid}>
          {iconOptions.map((option, index) => (
            <IconWithBadge
              key={index}
              IconComponent={option.IconComponent}
              name={option.name}
              label={option.label}
              badgeCount={option.badgeCount}
              onPress={() => console.log(`press ${option.label}`)}
            />
          ))}
        </View>
      </View>

      <SideMenu
        visible={menuVisible}
        onClose={closeMenu}
        onItemPress={(item: string) => {
          console.log(`Menu item pressed: ${item}`);
          closeMenu();
        }}
      />
    </SafeAreaView>
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
