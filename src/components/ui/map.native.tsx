import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

interface MapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
}

export const Map: React.FC<MapProps> = ({ initialRegion, style }) => {
  return (
    <MapView
      initialRegion={initialRegion}
      mapType='none'
      style={[styles.map, style]}
    >
      <UrlTile
        shouldReplaceMapContent={true}
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
});