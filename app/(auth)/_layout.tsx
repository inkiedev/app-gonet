import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
            title: 'Iniciar Sesión',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
