import BotonGonet from '@/components/BotonGonet';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

type RootStackParamList = {
  'explore': undefined;
  'mapaAgencia': undefined;
  'login': undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#588d62ff', dark: '#1D3D47' }}
      >
      <ThemedView >
       <ThemedText type="title">Bienvenido a GoNet</ThemedText>
        
      {  <BotonGonet
        title="Iniciar Sesion"
        logo={require('@/assets/images/favicon.png')}
        onPress={() => navigation.navigate('login')}
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
    left: 0,
    
  },
    publicidadGonet: {
    
    width: '100%',
    height: 200,
    left: 0,
    
  },
});
