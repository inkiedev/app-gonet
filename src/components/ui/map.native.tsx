import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, UrlTile } from 'react-native-maps';
import { WebView } from 'react-native-webview';

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
    image?: string; // Changed to string
  }[];
  onMarkerPress?: (marker: any) => void;
    userLocation?: { latitude: number; longitude: number } | null;
}

export interface MapRef {
  animateToRegion: (region: { latitude: number; longitude: number; }, duration?: number) => void;
}

export const Map = forwardRef<MapRef, MapProps>(({ initialRegion, style, polygons, markers, onMarkerPress, userLocation }, ref) => {
  const mapRef = useRef<MapView>(null);
  const webviewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, duration = 1000) => {
      if (Platform.OS === 'android') {
        const script = `map.flyTo([${region.latitude}, ${region.longitude}], 15, { animate: true, duration: ${duration / 1000} });`;
        webviewRef.current?.injectJavaScript(script);
      } else {
        mapRef.current?.animateToRegion({
          ...region,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, duration);
      }
    }
  }));

  if (Platform.OS === 'android') {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            canvas, img {
              image-rendering: crisp-edges;
              image-rendering: pixelated;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            const map = L.map('map').setView([${initialRegion.latitude}, ${initialRegion.longitude}], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            ${polygons?.map(polygon => `
              L.polygon(${JSON.stringify(polygon.coordinates.map(c => [c.latitude, c.longitude]))}, {color: '${polygon.strokeColor}', fillColor: '${polygon.fillColor}', fillOpacity: 0.5, weight: 0}).addTo(map);
            `).join('')}

            ${markers?.map(marker => `
              const markerIcon_${marker.id} = L.icon({
                  iconUrl: '${marker.image}',
                  iconSize: [38, 38], // size of the icon
              });
              L.marker([${marker.coordinate.latitude}, ${marker.coordinate.longitude}], {icon: markerIcon_${marker.id}})
                .addTo(map)
                .on('click', () => {
                  window.ReactNativeWebView.postMessage(JSON.stringify(${JSON.stringify(marker)}));
                });
            `).join('')}
          </script>
        </body>
      </html>
    `;
    
    return (
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={[styles.map, style]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
            if (onMarkerPress) {
                onMarkerPress(JSON.parse(event.nativeEvent.data));
            }
        }}
      />
    );
  }

  return (
    <MapView
      ref={mapRef}
      initialRegion={initialRegion}
      style={[styles.map, style]}
      mapType="none"
      showsUserLocation
    >
      <UrlTile
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        shouldReplaceMapContent={true}
        maximumZ={19}
        flipY={false}
        zIndex={-1}
        tileSize={256}
      />
      {polygons?.map((polygon, index) => (
        <Polygon
          key={index}
          coordinates={polygon.coordinates}
          strokeColor={polygon.strokeColor}
          fillColor={polygon.fillColor}
          strokeWidth={0}
        />
      ))}
      {markers?.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          image={{ uri: marker.image }} // Use { uri: string } for react-native-maps
          onPress={() => onMarkerPress && onMarkerPress(marker)}
        />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1 },
});