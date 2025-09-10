import React, { ComponentType, forwardRef, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { MapRef as NativeMapRef } from './map.native';
import { MapRef as WebMapRef } from './map.web';

// Define a unified MapRef that can hold refs for both native and web maps
export type MapRef = NativeMapRef & WebMapRef;

interface MapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  polygons?: {
    coordinates: { latitude: number; longitude: number }[];
    strokeColor?: string;
    fillColor?: string;
  }[];
  markers?: {
    id: string;
    coordinate: { latitude: number; longitude: number };
    title?: string;
    description?: string;
    image?: any;
  }[];
  onMarkerPress?: (marker: any) => void;
  onPress?: (event: { coordinate: { latitude: number; longitude: number } }) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  onMapReady?: () => void;
}

export const Map = forwardRef<MapRef, MapProps>((props, ref) => {
  const [MapComponent, setMapComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMapComponent = async () => {
      try {
        if (Platform.OS === 'web') {
          const { Map: WebMap } = await import('./map.web');
          setMapComponent(() => forwardRef<MapRef, MapProps>((props, ref) => <WebMap {...props} ref={ref} />));
        } else {
          const { Map: NativeMap } = await import('./map.native');
          setMapComponent(() => forwardRef<MapRef, MapProps>((props, ref) => <NativeMap {...props} ref={ref} />));
        }
      } catch (error) {
        console.warn('Failed to load map component:', error);
      } finally {
        setIsLoading(false);
        // Llamar onMapReady después de un breve delay para asegurar que el componente esté montado
        setTimeout(() => {
          props.onMapReady?.();
        }, 100);
      }
    };

    loadMapComponent();
  }, []);

  if (isLoading || !MapComponent) {
    console.log('Map component loading...', { isLoading, hasComponent: !!MapComponent });
    return null;
  }

  console.log('Rendering Map component with ref:', !!ref);
  return <MapComponent {...props} ref={ref} />;
});