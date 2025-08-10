import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, AntDesign, SimpleLineIcons, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { SpeedCircle } from '@/components/app/speed-circle';
import { IconWithBadge } from '@/components/app/icon-with-badge';
import { SideMenu } from '@/components/app/side-menu';
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
        <Card style={styles.planCard} variant="elevated">
          <Text style={styles.planTitle}>{mockUser.plan}</Text>
          <SpeedCircle speed={mockUser.speed} />
          <View style={styles.planFeatures}>
            <Text style={styles.featuresText}>
              Incluye: <AntDesign name="Safety" size={15} color={theme.colors.primaryDark} />{' '}
              <FontAwesome5 name="wifi" size={15} color={theme.colors.primaryDark} />{' '}
              <FontAwesome5 name="dollar-sign" size={15} color={theme.colors.primaryDark} />
            </Text>
          </View>
          <Text style={styles.detailsLink}>Ver Detalles</Text>
        </Card>

        <View style={styles.iconsGrid}>
          {iconOptions.map((option, index) => (
            <IconWithBadge
              key={index}
              IconComponent={option.IconComponent}
              name={option.name}
              label={option.label}
              badgeCount={option.badgeCount}
              onPress={() => console.log(`Pressed ${option.label}`)}
            />
          ))}
        </View>
      </View>

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onItemPress={(item: string) => {
          console.log(`Menu item pressed: ${item}`);
          setMenuVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    marginVertical: theme.spacing.lg,
  },
  planTitle: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.xxl,
    fontStyle: 'italic',
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  planFeatures: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  featuresText: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.md,
    fontStyle: 'italic',
  },
  detailsLink: {
    color: theme.colors.primaryDark,
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  iconsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
});
