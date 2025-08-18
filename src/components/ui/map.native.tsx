import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { WebView } from 'react-native-webview';

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
          </script>
        </body>
      </html>
    `;
    
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={[styles.map, style]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    );
  }

  return (
    <MapView
      initialRegion={initialRegion}
      style={[styles.map, style]}
      mapType="none"
    >
      <UrlTile
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        shouldReplaceMapContent={true}
        maximumZ={19}
        flipY={false}
        zIndex={1000}
        tileSize={256}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
});
