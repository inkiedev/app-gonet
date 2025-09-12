import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTheme } from '../../contexts/theme-context';

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

export interface MapRef {
  animateToRegion: (region: { latitude: number; longitude: number; }, duration?: number) => void;
}

export const Map = forwardRef<MapRef, MapProps>(({ initialRegion, style, polygons, markers, onMarkerPress, onPress, userLocation, onMapReady }, ref) => {
  const mapRef = useRef<any>(null);
  const { isDark } = useTheme();

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, duration = 1000) => {
      console.log('Map.web animateToRegion called with:', region, duration);
      mapRef.current?.flyTo([region.latitude, region.longitude], 15, {
        animate: true,
        duration: duration / 1000,
      });
    }
  }));

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
      <style>
        {`
          .leaflet-container.dark-map {
            filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2);
          }
        `}
      </style>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        className={isDark ? 'dark-map' : ''}
        whenCreated={(mapInstance: any) => { 
          mapRef.current = mapInstance;
          console.log('Web map created');
          
          // Add click event listener for onPress
          if (onPress) {
            mapInstance.on('click', (e: any) => {
              onPress({
                coordinate: {
                  latitude: e.latlng.lat,
                  longitude: e.latlng.lng
                }
              });
            });
          }
          
          onMapReady?.();
        }}
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
        {markers?.map((marker, index) => {
          const icon = marker.image ? L.icon({
            iconUrl: marker.image,
            iconSize: [40, 40],
          }) : gonetIcon;

          return (
            <LeafletMarker 
              key={index} 
              position={[marker.coordinate.latitude, marker.coordinate.longitude]}
              icon={icon}
              eventHandlers={{
                  click: () => {
                      if (onMarkerPress) {
                          onMarkerPress(marker);
                      }
                  }
              }}
            >
            </LeafletMarker>
          )
        })}
        {userLocation && (
            <CircleMarker center={[userLocation.latitude, userLocation.longitude]} radius={8} color="blue">
                <Popup>You are here</Popup>
            </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
});