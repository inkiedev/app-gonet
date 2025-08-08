import Button from '@/components/custom-button';
import InputField from '@/components/custom-input';
import CustomImage from '@/components/icon-gonet';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFonts } from 'expo-font';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const [fontsLoaded] = useFonts({
    'Barlow': require('@/assets/fonts/Barlow-Light.ttf'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    Alert.alert('Login exitoso', `Usuario: ${data.username}`);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/fondo_login.jpg')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{
          fontSize: 26,
          marginBottom: 20,
          color: 'white',
          fontFamily: 'Barlow',
          letterSpacing: 2
        }}>
          BIENVENIDO
        </Text>

        <CustomImage />

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
            <FontAwesome name="user" size={32} color="#04bbb2ff" />
          </View>
        </TouchableOpacity>

        <Text style={{
          fontSize: 10,
          marginBottom: 0,
          color: 'white',
          fontFamily: 'arial',
          fontWeight: "bold"
        }}>
          ¿Nuevo Usuario?
        </Text>
        <Text style={{
          fontSize: 10,
          marginBottom: 10,
          color: 'white',
          fontFamily: 'arial',
          fontWeight: "bold"
        }}>
          Registrate aqui
        </Text>

        <View style={{
          height: 1,
          backgroundColor: 'white',
          minWidth: "70%",
          marginTop: 10,
          marginBottom: 30
        }} />

        {/* Campo de usuario */}
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <InputField
              
              placeholder="Nombre de Usuario"
              value={value || ''}
              onChangeText={onChange}
              keyboardType="default"
            />
          )}
        />
        {errors.username && (
          <Text style={{ color: "rgba(255, 255, 255, 0.99)", marginBottom: 10 }}>{errors.username.message}</Text>
        )}

        {/* Campo de contraseña */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              placeholder="Contraseña"
              value={value || ''}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: "rgba(255, 255, 255, 0.99)", marginBottom: 10 }}>{errors.password.message}</Text>
        )}

        {/* Botón */}
        <Button text="Inicia Sesión" onPress={handleSubmit(onSubmit)} />
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
