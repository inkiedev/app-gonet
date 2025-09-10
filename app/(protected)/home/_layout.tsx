import { Stack, useSegments } from 'expo-router';
import Head from "expo-router/head";
import React from 'react';

export default function ProtectedHomeLayout() {
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];
  
  const getTitleForRoute = (route: string) => {
    const titles: Record<string, string> = {
      'index': 'Inicio - GoNet | Mi Panel de Control',
      'perfil': 'Mi Perfil - GoNet | Información personal',
      'ajustes': 'Configuración - GoNet | Ajustes de la app',
      'servicios': 'Servicios - GoNet | Planes y servicios adicionales',
      'planes': 'Mi Plan - GoNet | Gestiona tu plan de internet',
      'pagos': 'Pagos - GoNet | Facturas y métodos de pago',
      'soporte': 'Soporte Técnico - GoNet | Chat de ayuda',
      'calificanos': 'Calíficanos - GoNet | Tu opinión nos importa',
      'goclub': 'GoClub - GoNet | Beneficios y descuentos',
      'promociones': 'Promociones - GoNet | Ofertas especiales',
      'agencias': 'Agencias - GoNet | Encuentra nuestras oficinas'
    };
    return titles[route] || 'GoNet - Panel de Control';
  };

  return (
    <>
      <Head>
        <title>{getTitleForRoute(currentRoute)}</title>
      </Head>
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
          title: 'Inicio - GoNet | Mi Panel de Control',
          animation: 'fade',
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="perfil" 
        options={{
          title: 'Mi Perfil - GoNet | Información personal',
        }}
      />
      <Stack.Screen 
        name="ajustes" 
        options={{
          title: 'Configuración - GoNet | Ajustes de la app',
        }}
      />
      <Stack.Screen 
        name="servicios" 
        options={{
          title: 'Servicios - GoNet | Planes y servicios adicionales',
        }}
      />
      <Stack.Screen 
        name="planes" 
        options={{
          title: 'Mi Plan - GoNet | Gestiona tu plan de internet',
        }}
      />
      <Stack.Screen 
        name="pagos" 
        options={{
          title: 'Pagos - GoNet | Facturas y métodos de pago',
        }}
      />
      <Stack.Screen 
        name="soporte" 
        options={{
          title: 'Soporte Técnico - GoNet | Chat de ayuda',
        }}
      />
      <Stack.Screen 
        name="promociones" 
        options={{
          title: 'Promociones - GoNet | Ofertas especiales',
        }}
      />
      <Stack.Screen 
        name="agencias" 
        options={{
          title: 'Agencias - GoNet | Encuentra nuestras oficinas',
        }}
      />
      </Stack>
    </>
  );
}