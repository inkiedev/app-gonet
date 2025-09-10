import { useCallback, useMemo } from 'react';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface CoveragePolygon {
  coordinates: Coordinate[];
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
}

export interface UseCoverageOptions {
  polygons: CoveragePolygon[];
}

export const useCoverage = ({ polygons }: UseCoverageOptions) => {
  
  // Algoritmo point-in-polygon usando ray casting
  const isPointInPolygon = useCallback((
    point: Coordinate, 
    polygon: Coordinate[]
  ): boolean => {
    // Verificar que el punto y el polígono sean válidos
    if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
      console.warn('Invalid point:', point);
      return false;
    }
    
    if (!polygon || !Array.isArray(polygon) || polygon.length < 3) {
      console.warn('Invalid polygon:', polygon);
      return false;
    }
    
    let inside = false;
    const { latitude: x, longitude: y } = point;
    
    try {
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const vertex1 = polygon[i];
        const vertex2 = polygon[j];
        
        // Verificar que los vértices sean válidos
        if (!vertex1 || !vertex2 || 
            typeof vertex1.latitude !== 'number' || typeof vertex1.longitude !== 'number' ||
            typeof vertex2.latitude !== 'number' || typeof vertex2.longitude !== 'number') {
          console.warn('Invalid vertex:', vertex1, vertex2);
          continue;
        }
        
        const { latitude: xi, longitude: yi } = vertex1;
        const { latitude: xj, longitude: yj } = vertex2;
        
        if (((yi > y) !== (yj > y)) && 
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
    } catch (error) {
      console.error('Error in point-in-polygon calculation:', error);
      return false;
    }
    
    return inside;
  }, []);

  // Verificar si un punto está cubierto por cualquier polígono
  const isPointCovered = useCallback((point: Coordinate): boolean => {
    // Verificar que el punto sea válido
    if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
      console.warn('Invalid point in isPointCovered:', point);
      return false;
    }
    
    // Verificar que tengamos polígonos válidos
    if (!polygons || !Array.isArray(polygons) || polygons.length === 0) {
      console.warn('No valid polygons provided');
      return false;
    }
    
    try {
      return polygons.some(polygon => {
        if (!polygon || !polygon.coordinates || !Array.isArray(polygon.coordinates)) {
          console.warn('Invalid polygon structure:', polygon);
          return false;
        }
        return isPointInPolygon(point, polygon.coordinates);
      });
    } catch (error) {
      console.error('Error checking point coverage:', error);
      return false;
    }
  }, [polygons, isPointInPolygon]);

  // Obtener información de cobertura para un punto
  const getCoverageInfo = useCallback((point: Coordinate) => {
    // Verificar que el punto sea válido
    if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
      return {
        isCovered: false,
        coveredBy: [],
        coverageCount: 0,
      };
    }
    
    try {
      const coveredBy = polygons.filter(polygon => {
        if (!polygon || !polygon.coordinates || !Array.isArray(polygon.coordinates)) {
          return false;
        }
        return isPointInPolygon(point, polygon.coordinates);
      });
      
      return {
        isCovered: coveredBy.length > 0,
        coveredBy,
        coverageCount: coveredBy.length,
      };
    } catch (error) {
      console.error('Error getting coverage info:', error);
      return {
        isCovered: false,
        coveredBy: [],
        coverageCount: 0,
      };
    }
  }, [polygons, isPointInPolygon]);

  // Calcular el bounding box para todos los polígonos
  const boundingBox = useMemo(() => {
    if (!polygons || polygons.length === 0) return null;
    
    try {
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;
      
      polygons.forEach(polygon => {
        if (!polygon || !polygon.coordinates || !Array.isArray(polygon.coordinates)) {
          return;
        }
        
        polygon.coordinates.forEach((coord) => {
          if (!coord || typeof coord.latitude !== 'number' || typeof coord.longitude !== 'number') {
            return;
          }
          
          const { latitude, longitude } = coord;
          minLat = Math.min(minLat, latitude);
          maxLat = Math.max(maxLat, latitude);
          minLng = Math.min(minLng, longitude);
          maxLng = Math.max(maxLng, longitude);
        });
      });
      
      // Verificar que obtuvimos valores válidos
      if (minLat === Infinity || maxLat === -Infinity || minLng === Infinity || maxLng === -Infinity) {
        return null;
      }
      
      const centerLatitude = (minLat + maxLat) / 2;
      const centerLongitude = (minLng + maxLng) / 2;
      const latitudeDelta = (maxLat - minLat) * 1.2; // 20% padding
      const longitudeDelta = (maxLng - minLng) * 1.2; // 20% padding
      
      return {
        center: { latitude: centerLatitude, longitude: centerLongitude },
        bounds: { minLat, maxLat, minLng, maxLng },
        region: {
          latitude: centerLatitude,
          longitude: centerLongitude,
          latitudeDelta,
          longitudeDelta,
        },
      };
    } catch (error) {
      console.error('Error calculating bounding box:', error);
      return null;
    }
  }, [polygons]);

  // Calcular distancia entre dos puntos (en metros)
  const getDistance = useCallback((point1: Coordinate, point2: Coordinate): number => {
    // Verificar que los puntos sean válidos
    if (!point1 || !point2 || 
        typeof point1.latitude !== 'number' || typeof point1.longitude !== 'number' ||
        typeof point2.latitude !== 'number' || typeof point2.longitude !== 'number') {
      console.warn('Invalid points for distance calculation:', point1, point2);
      return Infinity;
    }
    
    try {
      const R = 6371000; // Radio de la Tierra en metros
      const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
      const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return Infinity;
    }
  }, []);

  // Encontrar el área de cobertura más cercana
  const getNearestCoverage = useCallback((point: Coordinate) => {
    if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
      return null;
    }
    
    if (!polygons || polygons.length === 0) return null;
    
    try {
      let nearestPolygon = polygons[0];
      let minDistance = Infinity;
      
      polygons.forEach(polygon => {
        if (!polygon || !polygon.coordinates || !Array.isArray(polygon.coordinates)) {
          return;
        }
        
        polygon.coordinates.forEach(coord => {
          if (!coord || typeof coord.latitude !== 'number' || typeof coord.longitude !== 'number') {
            return;
          }
          
          const distance = getDistance(point, coord);
          if (distance < minDistance) {
            minDistance = distance;
            nearestPolygon = polygon;
          }
        });
      });
      
      return {
        polygon: nearestPolygon,
        distance: minDistance,
      };
    } catch (error) {
      console.error('Error finding nearest coverage:', error);
      return null;
    }
  }, [polygons, getDistance]);

  return {
    polygons,
    isPointInPolygon,
    isPointCovered,
    getCoverageInfo,
    boundingBox,
    getDistance,
    getNearestCoverage,
  };
};

export default useCoverage;