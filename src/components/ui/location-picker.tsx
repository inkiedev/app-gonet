import { Button } from '@/components/ui/custom-button';
import Text from '@/components/ui/custom-text';
import { Map, MapRef } from "@/components/ui/map";
import { useTheme } from "@/contexts/theme-context";
import { Coordinate, CoveragePolygon, useCoverage } from "@/hooks/useCoverage";
import { useLocation } from "@/hooks/useLocation";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationPickerProps {
  polygons: CoveragePolygon[];
  onLocationSelect?: (coordinate: Coordinate, isVerified: boolean) => void;
  onLocationError?: (error: string) => void;
  style?: any;
  mapHeight?: number;
  showExpandButton?: boolean;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  selectedLocation?: Coordinate | null;
  title?: string;
}

export interface LocationPickerRef {
  openExpandedMap: () => void;
  centerOnLocation: (coordinate: Coordinate) => void;
  getCurrentLocation: () => Promise<void>;
}

export const LocationPicker = forwardRef<LocationPickerRef, LocationPickerProps>(({
  polygons,
  onLocationSelect,
  onLocationError,
  style,
  mapHeight = 200,
  showExpandButton = true,
  initialRegion,
  selectedLocation,
  title = "Seleccionar Ubicación"
}, ref) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme, mapHeight);
  
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  
  // Hooks
  const { coordinates, hasPermission, getLocationWithPermission } = useLocation();
  const { isPointCovered } = useCoverage({ polygons });
  
  const mapRef = useRef<MapRef>(null);
  const expandedMapRef = useRef<MapRef>(null);

  // Default initial region
  const defaultRegion = {
    latitude: coordinates?.latitude || -2.8700,
    longitude: coordinates?.longitude || -78.9900,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const region = initialRegion || defaultRegion;

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    openExpandedMap: () => setShowExpandedMap(true),
    centerOnLocation: (coordinate: Coordinate) => {
      mapRef.current?.animateToRegion(coordinate);
    },
    getCurrentLocation: async () => {
      await handleGetCurrentLocation(false);
    }
  }));

  // Handlers
  const handleLocationSelect = useCallback((event: any) => {
    if (!event || !event.coordinate || 
        typeof event.coordinate.latitude === 'undefined' || 
        typeof event.coordinate.longitude === 'undefined') {
      console.warn('Invalid coordinate data:', event);
      return;
    }
    
    const { coordinate } = event;
    
    // Verificar cobertura
    const covered = isPointCovered(coordinate);
    
    if (!covered) {
      onLocationError?.('Esta ubicación no está dentro del área de cobertura');
    } else {
      onLocationError?.("");
    }

    onLocationSelect?.(coordinate, covered);

    // Sincronizar ambos mapas
    setTimeout(() => {
      mapRef.current?.animateToRegion(coordinate);
    }, 100);
  }, [isPointCovered, onLocationSelect, onLocationError]);

  const handleGetCurrentLocation = useCallback(async (useExpandedMap = false) => {
    const location = await getLocationWithPermission();
    if (location && location.coords) {
      const coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Verificar cobertura
      const covered = isPointCovered(coordinate);
      
      if (!covered) {
        onLocationError?.('Tu ubicación actual no está dentro del área de cobertura');
      } else {
        onLocationError?.("");
      }

      onLocationSelect?.(coordinate, covered);

      // Centrar mapas
      if (useExpandedMap) {
        expandedMapRef.current?.animateToRegion(coordinate);
        setTimeout(() => {
          mapRef.current?.animateToRegion(coordinate);
        }, 100);
      } else {
        mapRef.current?.animateToRegion(coordinate);
      }
    }
  }, [getLocationWithPermission, isPointCovered, onLocationSelect, onLocationError]);

  const renderExpandedMap = () => (
    <Modal visible={showExpandedMap} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={dynamicStyles.expandedHeader}>
          <TouchableOpacity
            style={dynamicStyles.closeButton}
            onPress={() => setShowExpandedMap(false)}
          >
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={dynamicStyles.expandedTitle}>{title}</Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <Map
            ref={expandedMapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: selectedLocation?.latitude || region.latitude,
              longitude: selectedLocation?.longitude || region.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            polygons={polygons}
            onPress={handleLocationSelect}
            markers={selectedLocation ? [{
              id: 'selected',
              coordinate: selectedLocation,
              title: 'Ubicación seleccionada',
              description: isPointCovered(selectedLocation) ? 'Área con cobertura' : 'Sin cobertura',
            }] : []}
            userLocation={coordinates}
          />
          
          <View style={dynamicStyles.expandedMapControls}>
            <TouchableOpacity
              style={dynamicStyles.floatingButton}
              onPress={() => handleGetCurrentLocation(true)}
              disabled={!hasPermission}
            >
              <Ionicons name="locate" size={24} color={theme.colors.text.button} />
            </TouchableOpacity>
          </View>

          {selectedLocation && (
            <View style={dynamicStyles.expandedMapStatus}>
              <View style={[
                dynamicStyles.statusCard,
                { backgroundColor: theme.colors.surface }
              ]}>
                <Ionicons
                  name={isPointCovered(selectedLocation) ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={isPointCovered(selectedLocation) ? theme.colors.success : theme.colors.error}
                />
                <Text style={[
                  dynamicStyles.statusText,
                  { color: isPointCovered(selectedLocation) ? theme.colors.success : theme.colors.error }
                ]}>
                  {isPointCovered(selectedLocation) ? 'Ubicación con cobertura' : 'Ubicación sin cobertura'}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={dynamicStyles.bottomButtonContainer}>
          <Button
            disabled={selectedLocation ? !isPointCovered(selectedLocation) : false}
            title="Listo"
            fullWidth
            onPress={() => setShowExpandedMap(false)}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={[dynamicStyles.container, style]}>
      <View style={dynamicStyles.mapContainer}>
        <Map
          ref={mapRef}
          style={dynamicStyles.map}
          initialRegion={region}
          polygons={polygons}
          onPress={handleLocationSelect}
          markers={selectedLocation ? [{
            id: 'selected',
            coordinate: selectedLocation,
            title: 'Ubicación seleccionada',
            description: isPointCovered(selectedLocation) ? 'Área con cobertura' : 'Sin cobertura',
          }] : []}
          userLocation={coordinates}
        />
        
        <View style={dynamicStyles.mapControls}>
          <TouchableOpacity
            style={dynamicStyles.mapButton}
            onPress={() => handleGetCurrentLocation()}
            disabled={!hasPermission}
          >
            <Ionicons name="locate" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          
          {showExpandButton && (
            <TouchableOpacity
              style={dynamicStyles.mapButton}
              onPress={() => setShowExpandedMap(true)}
            >
              <Ionicons name="expand" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {renderExpandedMap()}
    </View>
  );
});

LocationPicker.displayName = 'LocationPicker';

const createDynamicStyles = (theme: any, mapHeight: number) => StyleSheet.create({
  container: {},
  mapContainer: {
    position: 'relative',
    height: mapHeight,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  mapButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Expanded Map Styles
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.md,
  },
  expandedTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  expandedMapControls: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
  },
  floatingButton: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  expandedMapStatus: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: 80,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '85%'
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  bottomButtonContainer : {
    margin: theme.spacing.sm,
  },
});

export default LocationPicker;