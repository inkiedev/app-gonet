import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  location: Location.LocationObject | null;
  permission: Location.PermissionStatus | null;
  loading: boolean;
  error: string | null;
}

interface UseLocationOptions {
  accuracy?: Location.Accuracy;
  enableBackground?: boolean;
  watchPosition?: boolean;
  timeout?: number;
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    accuracy = Location.Accuracy.Balanced,
    enableBackground = false,
    watchPosition = false,
    timeout = 10000,
  } = options;

  const [state, setState] = useState<LocationState>({
    location: null,
    permission: null,
    loading: false,
    error: null,
  });

  // Request location permissions
  const requestPermissions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (enableBackground && status === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
      }

      setState(prev => ({ ...prev, permission: status, loading: false }));
      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permissions';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return null;
    }
  }, [enableBackground]);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const location = await Location.getCurrentPositionAsync({
        accuracy,
        timeout,
      });

      setState(prev => ({ ...prev, location, loading: false }));
      return location;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return null;
    }
  }, [accuracy, timeout]);

  // Get location with permission check
  const getLocationWithPermission = useCallback(async () => {
    const permissionStatus = state.permission || await requestPermissions();
    
    if (permissionStatus === 'granted') {
      return await getCurrentLocation();
    }
    
    setState(prev => ({ ...prev, error: 'Location permission denied' }));
    return null;
  }, [state.permission, requestPermissions, getCurrentLocation]);

  // Watch position (if enabled)
  useEffect(() => {
    if (!watchPosition || state.permission !== 'granted') {
      return;
    }

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Update when moved 10 meters
          },
          (location) => {
            setState(prev => ({ ...prev, location }));
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to watch position';
        setState(prev => ({ ...prev, error: errorMessage }));
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [watchPosition, state.permission, accuracy]);

  // Initialize permissions on mount
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  // Utility functions
  const hasPermission = state.permission === 'granted';
  const coordinates = state.location?.coords ? {
    latitude: state.location.coords.latitude,
    longitude: state.location.coords.longitude,
  } : null;

  return {
    ...state,
    coordinates,
    hasPermission,
    requestPermissions,
    getCurrentLocation,
    getLocationWithPermission,
  };
};

export default useLocation;