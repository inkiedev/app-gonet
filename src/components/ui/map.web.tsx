import React from 'react';

// Dynamically import leaflet only on web
let MapContainer: any, TileLayer: any, LeafletMarker: any, Popup: any, Polygon: any, CircleMarker: any, L: any;

if (typeof window !== 'undefined') {
  const leaflet = require('react-leaflet');
  L = require('leaflet');
  MapContainer = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  LeafletMarker = leaflet.Marker;
  Popup = leaflet.Popup;
  Polygon = leaflet.Polygon;
  CircleMarker = leaflet.CircleMarker;
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
  polygons?: {
    coordinates: { latitude: number; longitude: number }[];
    strokeColor?: string;
    fillColor?: string;
  }[];
  markers?: {
    coordinate: { latitude: number; longitude: number };
    title?: string;
    description?: string;
    image?: any;
  }[];
  onMarkerPress?: (marker: any) => void;
    userLocation?: { latitude: number; longitude: number } | null;
}

export const Map: React.FC<MapProps> = ({ initialRegion, style, polygons, markers, onMarkerPress, userLocation }) => {
  // Return null if not on web platform
  if (typeof window === 'undefined' || !MapContainer || !TileLayer) {
    return null;
  }

  const center: [number, number] = [initialRegion.latitude, initialRegion.longitude];
  
  // Calculate zoom level from delta (approximate conversion)
  const zoom = Math.round(Math.log(360 / initialRegion.latitudeDelta) / Math.LN2);

  const gonetIcon = L.icon({
    iconUrl: 'https://gonet.ec/wp-content/uploads/2021/08/GoNet.png',
    iconSize: [40, 40], // size of the icon
  });

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
        {polygons?.map((polygon, index) => (
          <Polygon
            key={index}
            positions={polygon.coordinates.map(c => [c.latitude, c.longitude])}
            pathOptions={{ color: polygon.strokeColor, fillColor: polygon.fillColor, fillOpacity: 0.5 }}
          />
        ))}
        {markers?.map((marker, index) => (
          <LeafletMarker 
            key={index} 
            position={[marker.coordinate.latitude, marker.coordinate.longitude]}
            icon={gonetIcon}
            eventHandlers={{
                click: () => {
                    if (onMarkerPress) {
                        onMarkerPress(marker);
                    }
                }
            }}
          >
          </LeafletMarker>
        ))}
        {userLocation && (
            <CircleMarker center={[userLocation.latitude, userLocation.longitude]} radius={8} color="blue">
                <Popup>You are here</Popup>
            </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
};