import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: 'Iniciar Sesión - GoNet | Accede a tu cuenta',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Registro - GoNet | Crear cuenta nueva',
          }}
        />
        <Stack.Screen
          name="contact-form"
          options={{
            title: 'Contáctanos - GoNet | Solicita información',
          }}
        />
      </Stack>
    </>
  );
}
