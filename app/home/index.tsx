import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/card';
import { FontAwesome, Ionicons, FontAwesome5, AntDesign, Entypo, SimpleLineIcons, FontAwesome6, MaterialCommunityIcons, MaterialIcons, Foundation } from '@expo/vector-icons';
import SpeedCircle from '@/components/speed-circle';
import IconWithBadge from '@/components/home/icon-with-badge';
import { Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Home: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useRouter();

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => setMenuVisible(false));
    } else {
      // Apertura del menú
      setMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleMenu}>
              <Entypo name="menu" size={24} color="#00ff9b" />
            </TouchableOpacity>
            <View style={styles.namesContainer}>
              <Text style={{ color: '#009a94', fontSize: 16, fontStyle: 'italic' }}>Juan</Text>
              <Text style={{ color: '#009a94', fontSize: 16, fontStyle:'italic' }}>Gonzales</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.push('/home/ajustes')}>
              <FontAwesome name="user" size={24} color="#00ff9b" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.main}>
          <Card style={styles.planContainer}>
            <Text style={{ color: '#009a94', fontSize: 26, fontStyle: 'italic', fontWeight: 'bold', textAlign: "center" }}>GoPlus</Text>
            <SpeedCircle />
            <View style={{ width: '100%', paddingLeft: 15, paddingTop: 10 }}>
              <Text style={{ color: '#009a94', fontSize: 16, textAlign: "left", fontStyle: "italic" }}>Incluye:&nbsp;
                <AntDesign name="Safety" size={15} color="#009a94" /> &nbsp;
                <FontAwesome5 name="wifi" size={15} color="#009a94" /> &nbsp;
                <FontAwesome5 name="dollar-sign" size={15} color="#009a94" />
              </Text>
            </View>
            <Text style={{ color: '#009a94', marginTop: 15, marginBottom: 5, fontSize: 15, textAlign: "left", fontStyle: "italic", textDecorationLine: "underline"  }}>Ver Detalles</Text>
          </Card>
          <View style={styles.optionsContainer}>
            <View style={styles.optionsButton}>
              <IconWithBadge
                IconComponent={SimpleLineIcons}
                name="envelope"
                size={55}
                color="#000000"
                badgeCount={2}
              />
              <Text style={styles.iconLegend}>
                Mensajes
              </Text>
            </View>
            <View style={styles.optionsButton}>
              <IconWithBadge
                IconComponent={FontAwesome6}
                name="hand-holding-dollar"
                size={55}
                color="#000000"
                badgeCount={undefined}
              />
              <Text style={styles.iconLegend}>
                Pagos
              </Text>
            </View>
            <View style={styles.optionsButton}>
              <IconWithBadge
                IconComponent={Ionicons}
                name="logo-apple"
                size={55}
                color="#000000"
                badgeCount={"+"}
                badgeStyles={{
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                  right: 25
                }}
              />
              <Text style={styles.iconLegend}>
                +Servicios
              </Text>
            </View>
            <View style={styles.optionsButton}>
              <IconWithBadge
                IconComponent={MaterialIcons}
                name="contact-support"
                size={55}
                color="#000000"
                badgeCount={undefined}
              />
              <Text style={styles.iconLegend}>
                Mensajes
              </Text>
            </View>
          </View>
        </View>
        {menuVisible && (
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
              <SafeAreaView style={styles.safeMenuWrapper}>
                <Animated.View
                  style={[
                    styles.menuContainer,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <Text style={styles.menuItem}>Inicio</Text>
                  <Text style={styles.menuItem}>Perfil</Text>
                  <Text style={styles.menuItem}>Ajustes</Text>
                  <Text style={styles.menuItem}>Cerrar Sesión</Text>
                </Animated.View>
              </SafeAreaView>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, 
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
  },
  planContainer: {
    width: 275,
  },
  iconLegend: {
    color: '#009a94',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 70,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 998,
  },

  safeMenuWrapper: {
    flex: 1,
  },

  menuContainer: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.5,
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },

  menuItem: {
    fontSize: 16,
    color: '#009a94',
    fontStyle: 'italic',
    marginBottom: 15,
  },
});

export default Home;