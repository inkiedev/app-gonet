import { Stack } from 'expo-router';
import React from 'react';

export default function ProtectedHomeLayout() {
  return (
    <Stack
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="ajustes" />
      <Stack.Screen name="servicios" />
      <Stack.Screen name="planes" />
      <Stack.Screen name="pagos" />
      <Stack.Screen name="soporte" />
      <Stack.Screen name="calificanos" />
      <Stack.Screen name="goclub" />
      <Stack.Screen name="promociones" />
      <Stack.Screen name="agencias" />
    </Stack>
  );
}