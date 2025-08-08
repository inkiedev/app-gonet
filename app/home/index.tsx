import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/card';
import { FontAwesome, Ionicons, FontAwesome5, AntDesign, Entypo } from '@expo/vector-icons';
import SpeedCircle from '@/components/speed-circle';
import { LinearGradient } from 'expo-linear-gradient';

const Home: React.FC = () => {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.header}>
            <Entypo name="menu" size={24} color="#00ff9b" />
            <View style={styles.namesContainer}>
              <Text style={{ color: '#009a94', fontSize: 16, fontStyle: 'italic' }}>Juan</Text>
              <Text style={{ color: '#009a94', fontSize: 16, fontStyle:'italic' }}>Gonzales</Text>
            </View>
            <FontAwesome name="user" size={24} color="#00ff9b" />
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
        </View>
        <View>
          <View></View>
        </View>
        <View style={styles.footer}>
          <LinearGradient
            colors={['#00543b', '#00d280', '#006a54']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconsContainer}>
              <Card>
                <FontAwesome name="instagram" size={20} color="black" />
              </Card>
              <Card>
                <FontAwesome name="facebook" size={20} color="black" />
              </Card>
              <Card>
                <Ionicons name="globe-outline" size={20} color="black" />
              </Card>
              <Card>
                <FontAwesome name="twitter" size={20} color="black" />
              </Card>
              <Card>
                <Ionicons name="location-sharp" size={20} color="black" />
              </Card>
            </View>
            <View>
              <Text style={{ color: '#fff', fontSize: 10, marginTop: 25 }}>Ver 2.00.00.01</Text>
            </View>
          </LinearGradient>
        </View>
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
    width: '100%',
    padding: 60,
  },
  footer: {
    width: '100%',
    height: 150,
  },
  iconsContainer: {
    width: '80%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  planContainer: {
    width: 275,
  },
  gradient: {
    flex: 1,
    width: '100%',
      display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;