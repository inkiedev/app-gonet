import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, UrlTile } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../contexts/theme-context';

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
    width?: number;
    height?: number;
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
  const mapRef = useRef<MapView>(null);
  const webviewRef = useRef<WebView>(null);
  const { isDark } = useTheme();

  const tileUrl = isDark 
    ? "https://a.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}.png"
    : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, duration = 1000) => {
      if (Platform.OS === 'android') {
        const script = `map.flyTo([${region.latitude}, ${region.longitude}], 15, { animate: true, duration: ${duration / 1000} });`;
        webviewRef.current?.injectJavaScript(script);
      } else {
        const animatedRegion = {
          ...region,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        mapRef.current?.animateToRegion(animatedRegion, duration);
      }
    }
  }));

  if (Platform.OS === 'android') {
    const [isWebViewReady, setWebViewReady] = React.useState(false);

    const htmlContent = React.useMemo(() => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background-color: ${isDark ? '#000' : '#fff'};
            }
            #map { 
              height: 100vh; 
              width: 100vw; 
              background-color: ${isDark ? '#000' : '#fff'};
              ${isDark ? `filter: invert(1) hue-rotate(180deg) brightness(1) contrast(0.8);` : ''}
            }
            .leaflet-marker-icon {
              ${isDark ? `filter: invert(1) hue-rotate(180deg) brightness(1) contrast(0.8);` : ''}
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            var map = L.map('map').setView([${initialRegion.latitude}, ${initialRegion.longitude}], 13);
            var leafletMarkers = [];

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            ${polygons ? `
              var polygonData = ${JSON.stringify(polygons)};
              polygonData.forEach(function(p) {
                var coords = p.coordinates.map(function(c) { return [c.latitude, c.longitude]; });
                L.polygon(coords, {color: p.strokeColor, fillColor: p.fillColor, fillOpacity: 0.5, weight: 0}).addTo(map);
              });
            ` : ''}

            ${onPress ? `
              map.on('click', function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapPress',
                  coordinate: { latitude: e.latlng.lat, longitude: e.latlng.lng }
                }));
              });
            ` : ''}
          </script>
        </body>
      </html>
    `, [initialRegion.latitude, initialRegion.longitude, isDark, polygons, onPress]);

    React.useEffect(() => {
      if (isWebViewReady) {
        const script = `
          leafletMarkers.forEach(marker => marker.remove());
          leafletMarkers = [];
          var markersData = ${JSON.stringify(markers || [])};

          markersData.forEach(function(marker) {
            var leafletMarker;
            if (marker.image) {
              var markerIcon = L.icon({
                  iconUrl: marker.image,
                  iconSize: [marker.width || 38, marker.height || 38],
              });
              leafletMarker = L.marker([marker.coordinate.latitude, marker.coordinate.longitude], {icon: markerIcon});
            } else {
              leafletMarker = L.marker([marker.coordinate.latitude, marker.coordinate.longitude]);
            }
            
            leafletMarker.addTo(map)
              .bindPopup(marker.title || '' + (marker.description ? '<br>' + marker.description : ''))
              .on('click', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'markerPress',
                  marker: marker
                }));
              });
            leafletMarkers.push(leafletMarker);
          });
        `;
        webviewRef.current?.injectJavaScript(script);
      }
    }, [markers, isWebViewReady]);
    
    return (
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={[styles.map, { backgroundColor: isDark ? '#793f3fff' : '#47a34eff' }, style]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        androidHardwareAccelerationDisabled={true} // yo creo que esto se puede retirar
        onLoad={() => {
          setWebViewReady(true);
          onMapReady?.();
        }}
        onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'markerPress' && onMarkerPress) {
                  onMarkerPress(data.marker);
              } else if (data.type === 'mapPress' && onPress) {
                  onPress({ coordinate: data.coordinate });
              }
            } catch (e) {
              console.error('Error parsing message from WebView', e);
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
      onPress={(event) => {
        console.log('Native map press event:', event);
        if (onPress && event && event.nativeEvent && event.nativeEvent.coordinate) {
          onPress({ coordinate: event.nativeEvent.coordinate });
        }
      }}
      onMapReady={() => {
        onMapReady?.();
      }}
    >
      <UrlTile
        urlTemplate={tileUrl}
        shouldReplaceMapContent={true}
        maximumZ={19}
        flipY={false}
        zIndex={-1}
        tileSize={256}
        attribution={attribution}
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
          onPress={() => onMarkerPress && onMarkerPress(marker)}
          pinColor={marker.id === 'selected' ? 'red' : marker.id === 'user' ? 'blue' : 'red'}
        >
          {marker.image && (
            <Image source={{ uri: marker.image }} style={{ width: marker.width || 40, height: marker.height || 40 }} />
          )}
        </Marker>
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1 },
});
