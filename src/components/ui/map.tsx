import React, { ComponentType, useEffect, useState, forwardRef } from 'react';
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
    userLocation?: { latitude: number; longitude: number } | null;
}

export const Map = forwardRef<MapRef, MapProps>((props, ref) => {
  const [MapComponent, setMapComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMapComponent = async () => {
      try {
        if (Platform.OS === 'web') {
          const { Map: WebMap } = await import('./map.web');
          setMapComponent(() => WebMap);
        } else {
          const { Map: NativeMap } = await import('./map.native');
          setMapComponent(() => NativeMap);
        }
      } catch (error) {
        console.warn('Failed to load map component:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapComponent();
  }, []);

  if (isLoading || !MapComponent) {
    return null;
  }

  return <MapComponent {...props} ref={ref} />;
});