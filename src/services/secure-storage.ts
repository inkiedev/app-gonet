import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  REMEMBER_ME: 'remember_me',
  BIOMETRIC_PREFERENCES: 'biometric_preferences',
  USER_DATA: 'user_data',
  SESSION_ID: 'session_id',
  USERNAME: 'username',
};

export interface BiometricPreferences {
  useBiometricForPassword: boolean;
  useBiometricForLogin: boolean;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  phone: string;
  street: string;
  city: string;
  street2: string;
  vat: string;
}

class SecureStorageService {
  private async setSecureItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  private async getSecureItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  private async deleteSecureItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  async saveRememberMe(username: string, rememberMe: boolean): Promise<void> {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
      } else {
        await this.clearRememberMe();
      }
    } catch (error) {
      console.error('Error saving remember me:', error);
      throw new Error('No se pudo guardar la preferencia de recordar');
    }
  }

  async getRememberMe(): Promise<{ rememberMe: boolean; username: string | null }> {
    try {
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      
      return {
        rememberMe: rememberMe === 'true',
        username: rememberMe === 'true' ? username : null
      };
    } catch (error) {
      console.error('Error getting remember me:', error);
      return { rememberMe: false, username: null };
    }
  }

  async clearRememberMe(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      await AsyncStorage.removeItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error('Error clearing remember me:', error);
    }
  }

  async isRememberMeEnabled(): Promise<boolean> {
    try {
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return rememberMe === 'true';
    } catch (error) {
      return false;
    }
  }

  async saveBiometricPreferences(preferences: BiometricPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving biometric preferences:', error);
      throw new Error('No se pudieron guardar las preferencias biométricas');
    }
  }

  async getBiometricPreferences(): Promise<BiometricPreferences | null> {
    try {
      const preferencesData = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES);
      if (!preferencesData) {
        return null;
      }
      return JSON.parse(preferencesData);
    } catch (error) {
      console.error('Error getting biometric preferences:', error);
      return null;
    }
  }

  async clearBiometricPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES);
    } catch (error) {
      console.error('Error clearing biometric preferences:', error);
    }
  }

  async saveUserData(userData: UserData): Promise<void> {
    try {
      // Guardamos los datos del usuario sin encriptación en AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('No se pudieron guardar los datos del usuario');
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      // Obtener los datos del usuario desde AsyncStorage sin encriptación
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userDataString) {
        return null;
      }
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async clearUserData(): Promise<void> {
    try {
      // Limpiar los datos del usuario desde AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  async saveSessionId(sessionId: string): Promise<void> {
    try {
      // El session_id se guarda en almacenamiento seguro ya que es sensible
      await this.setSecureItem(STORAGE_KEYS.SESSION_ID, sessionId);
    } catch (error) {
      console.error('Error saving session ID:', error);
      throw new Error('No se pudo guardar el session ID');
    }
  }

  async getSessionId(): Promise<string | null> {
    try {
      return await this.getSecureItem(STORAGE_KEYS.SESSION_ID);
    } catch (error) {
      console.error('Error getting session ID:', error);
      return null;
    }
  }

  async clearSessionId(): Promise<void> {
    try {
      await this.deleteSecureItem(STORAGE_KEYS.SESSION_ID);
    } catch (error) {
      console.error('Error clearing session ID:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.clearSessionId();
      await this.clearRememberMe();
      await this.clearUserData();
      await this.clearBiometricPreferences();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

export const secureStorageService = new SecureStorageService();