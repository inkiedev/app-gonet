import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export const useBiometricAuth = () => {
  const authenticateWithBiometrics = async (): Promise<BiometricAuthResult> => {
    try {
      if (Platform.OS === 'web') {
        return { success: false, error: 'Biometrics not available on web' };
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return { success: false, error: 'Device does not support biometric authentication' };
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return { success: false, error: 'No biometric records found on device' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación requerida',
        fallbackLabel: 'Usar contraseña del dispositivo',
        disableDeviceFallback: false,
        cancelLabel: 'Cancelar'
      });

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (error) {
      return { success: false, error: 'Error during authentication' };
    }
  };

  const checkBiometricAvailability = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  };

  return {
    authenticateWithBiometrics,
    checkBiometricAvailability
  };
};