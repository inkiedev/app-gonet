import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
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
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="ajustes" 
        options={{
          animation: 'slide_from_bottom',
          animationDuration: 350,
        }}
      />
      <Stack.Screen 
        name="perfil" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="agencias" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="pagos" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="soporte" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="servicios" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="promociones" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="goclub" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="calificanos" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="planes" 
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}