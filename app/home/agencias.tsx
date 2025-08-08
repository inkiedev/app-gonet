// src/screens/MapUniversal.tsx
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type Props = {
  latitude?: number;
  longitude?: number;
  zoomDelta?: { latitudeDelta: number; longitudeDelta: number };
  height?: number | string;
};

export default function MapUniversal({
  latitude = -2,
  longitude = -72,
  zoomDelta = { latitudeDelta: 0.5, longitudeDelta: 0.5 },
  height = '100%',
}: Props) {
  const isWeb = Platform.OS === 'web';

  // iframe src usando OpenStreetMap (marca el punto con marker)
  const osmIframeSrc = useMemo(() => {
    // bbox para el embed (aprox): (lon_min,lat_min,lon_max,lat_max)
    const lon = longitude;
    const lat = latitude;
    const bboxSize = 0.5; // controla el zoom (menor => más zoom)
    const lonMin = lon - bboxSize;
    const latMin = lat - bboxSize;
    const lonMax = lon + bboxSize;
    const latMax = lat + bboxSize;

    // Usamos marker en el centro
    // openstreetmap embed url
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      `${lonMin},${latMin},${lonMax},${latMax}`
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }, [latitude, longitude]);

  if (isWeb) {
    // Web: renderizar iframe con OSM (funciona sin API keys)
    return (
      <View style={[styles.wrapper, { height }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Mapa (Web)</Text>
        </View>

        <View style={styles.iframeContainer}>
          <iframe
            title="map"
            src={osmIframeSrc}
            style={styles.iframe}
            loading="lazy"
          />
        </View>
      </View>
    );
  }

  // Mobile: import dinámico para evitar import en web
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const MapView = require('react-native-maps').default;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Marker = require('react-native-maps').Marker;

  return (
    <View style={[styles.wrapper, { height }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa (Móvil)</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: zoomDelta.latitudeDelta,
          longitudeDelta: zoomDelta.longitudeDelta,
        }}
        showsUserLocation={false}
        showsMyLocationButton={true}
      >
        <Marker coordinate={{ latitude, longitude }} title="Centro" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  header: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  iframeContainer: {
    flex: 1,
    // para web el iframe necesita height explícito
    height: 'calc(100% - 48px)' as any,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 0,
  } as any,
  map: {
    flex: 1,
  },
});
