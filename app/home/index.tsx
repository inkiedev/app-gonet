import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/card';
import { FontAwesome, Ionicons, FontAwesome5, AntDesign, Entypo, SimpleLineIcons, FontAwesome6, MaterialCommunityIcons, MaterialIcons, Foundation, Feather } from '@expo/vector-icons';
import SpeedCircle from '@/components/speed-circle';
import IconWithBadge from '@/components/home/icon-with-badge';
import { Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { optionsMenu } from '@/constants/home-constants';
import { styles } from '@/styles/home-index-styles';

const screenWidth = Dimensions.get('window').width;

const Home: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.5)).current;
  const navigation = useRouter();

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 0.7,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={{ zIndex: 1000 }}>
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
          <Text style={{ color: '#009a94', marginTop: 15, marginBottom: 5, fontSize: 14, textAlign: "left", fontStyle: "italic", textDecorationLine: "underline"  }}>Ver Detalles</Text>
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
          <Animated.View style={[styles.overlay]}>
            <SafeAreaView style={styles.safeMenuWrapper}>
              <Animated.View
                style={[
                  styles.menuContainer,
                  { transform: [{ translateX: slideAnim }] }
                ]}
              >
                {
                  optionsMenu.map((option, index) => (
                    <View key={index} style={styles.menuItemContainer}>
                      {option.icon}
                      <Text style={styles.menuItem}>{option.label}</Text>
                    </View>
                  ))
                }
              </Animated.View>
            </SafeAreaView>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default Home;