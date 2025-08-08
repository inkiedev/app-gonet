//import InputField from '@/components/custom-input';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Button from '@/components/custom-button';
import InputField from '@/components/custom-input';
import CustomImage from '@/components/icon-gonet';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';





const LoginScreen = () => {

  const [fontsLoaded] = useFonts({
    'Barlow': require('@/assets/fonts/Barlow-Light.ttf'), // Thin 100
  });


  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  return (

      <ImageBackground source={require('@/assets/images/fondo_login.jpg')}  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex : 2 }}>

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 26, marginBottom: 20 , color: 'white', fontFamily : "Barlow",letterSpacing:2}}>BIENVENIDO</Text>
      <CustomImage/>

<TouchableOpacity onPress={() => console.log('Icon pressed forget password')}>
  <View style={{
    backgroundColor: 'white',
    width: 58,
    borderRadius: 50,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  }}>
    <FontAwesome name="user" size={32} color="#04bbb2ff" style ={{justifyContent: 'center'}}/>
  </View>

  
</TouchableOpacity>



<Text style={{ fontSize: 10, marginBottom: 0 , color: 'white', fontFamily : 'arial',fontWeight:"bold"}}>¿Nuevo Usuario?</Text>
<Text style={{ fontSize: 10, marginBottom: 10 , color: 'white', fontFamily : 'arial',fontWeight:"bold"}}>Registrate aqui</Text>


  <View style={{ height: 1, backgroundColor: 'white', minWidth : "70%",marginTop: 10 , marginBottom: 30 }} />


      <InputField
        placeholder="Nombre de Usuario"
        value={user}
        onChangeText={setUser}
        keyboardType="numeric"
      />
      <InputField
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button text="Inicia Sesión" onPress={() => console.log(user, password)} />
    </View>
        
        </ImageBackground>
  
  );
};

export default LoginScreen;
