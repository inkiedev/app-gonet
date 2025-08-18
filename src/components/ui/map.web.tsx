import React from 'react';

// Dynamically import leaflet only on web
let MapContainer: any, TileLayer: any;

if (typeof window !== 'undefined') {
  const leaflet = require('react-leaflet');
  MapContainer = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  require('leaflet/dist/leaflet.css');
}

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
  // Return null if not on web platform
  if (typeof window === 'undefined' || !MapContainer || !TileLayer) {
    return null;
  }

  const center: [number, number] = [initialRegion.latitude, initialRegion.longitude];
  
  // Calculate zoom level from delta (approximate conversion)
  const zoom = Math.round(Math.log(360 / initialRegion.latitudeDelta) / Math.LN2);

  return (
    <div style={{ ...style, width: '100%', height: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};