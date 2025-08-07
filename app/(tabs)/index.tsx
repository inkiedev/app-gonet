// esta nota es el home


import BotonGonet from '@/components/BotonGonet';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';





type RootStackParamList = {
  'app/(tabs)/explore': undefined;
  'mapaAgencia': undefined;
  // add other routes here if needed
};
export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#588d62ff', dark: '#1D3D47' }}
      >
      <ThemedView >
       <ThemedText type="title">Bienvenido a Gonet</ThemedText>
       <HelloWave />
        
      {  <BotonGonet
        title="Ir a Servicios"
        logo={require('@/assets/images/favicon.png')}
        onPress={() => navigation.navigate('mapaAgencia')}
      />}
       {  <BotonGonet
        title="Planes"
        logo={require('@/assets/images/favicon.png')}
        onPress={() => navigation.navigate('app/(tabs)/explore')}
      />}

       {  <BotonGonet
        title="Pagos"
        logo={require('@/assets/images/favicon.png')}
        onPress={() => navigation.navigate('app/(tabs)/explore')}
      />}

       {  <BotonGonet
        title="Cliente"
        logo={require('@/assets/images/favicon.png')}
        onPress={() => navigation.navigate('app/(tabs)/explore')}
      />}


        
      </ThemedView>
      
     
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "40%",
    width: '100%',
    //bottom: 0,
    left: 0,
    
  },
    publicidadGonet: {
    
    width: '100%',
    height: 200,
    //bottom: 0,
    left: 0,
    
  },
});
