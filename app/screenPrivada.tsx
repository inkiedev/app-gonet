import BotonGonet from '@/components/BotonGonet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

type RootStackParamList = {
  mapaAgencia: undefined;
  servicios: undefined;
  configuracion: undefined;
  perfil: undefined;
};

export default function ScreenPrivada() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/gonetPublicidad2.jpg')} // Reemplaza con tu imagen
        style={styles.headerImage}
        resizeMode="contain"
      />

      <View style={styles.grid}>
        <View style={styles.buttonWrapper}>
          <BotonGonet
            title="Agencias"
            logo={require('@/assets/images/favicon.png')}
            onPress={() => navigation.navigate('mapaAgencia')}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <BotonGonet
            title="Servicios"
            logo={require('@/assets/images/favicon.png')}
            onPress={() => navigation.navigate('servicios')}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <BotonGonet
            title="Configuración"
            logo={require('@/assets/images/favicon.png')}
            onPress={() => navigation.navigate('configuracion')}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <BotonGonet
            title="Perfil"
            logo={require('@/assets/images/favicon.png')}
            onPress={() => navigation.navigate('perfil')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  buttonWrapper: {
    width: '48%', // 2 botones por fila
    marginBottom: 20,
  },
});
