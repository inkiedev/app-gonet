import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  CREDENTIALS: 'secure_credentials',
  REMEMBER_ME: 'remember_me',
  BIOMETRIC_PREFERENCES: 'biometric_preferences',
};

const ENCRYPTION_KEY = 'gonet_app_secure_key_2024';

export interface StoredCredentials {
  uid: number;
  username: string;
  password: string;
}

export interface BiometricPreferences {
  useBiometricForPassword: boolean;
  useBiometricForLogin: boolean;
}

class SecureStorageService {
  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private async setSecureItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      const encryptedValue = this.encrypt(value);
      await AsyncStorage.setItem(key, encryptedValue);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  private async getSecureItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      const encryptedValue = await AsyncStorage.getItem(key);
      if (!encryptedValue) return null;
      return this.decrypt(encryptedValue);
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

  async saveCredentials(credentials: StoredCredentials, rememberMe: boolean): Promise<void> {
    try {
      if (rememberMe) {
        await this.setSecureItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
        await this.setSecureItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        await this.clearCredentials();
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw new Error('No se pudieron guardar las credenciales');
    }
  }

  async getCredentials(): Promise<StoredCredentials | null> {
    try {
      const rememberMe = await this.getSecureItem(STORAGE_KEYS.REMEMBER_ME);
      if (rememberMe !== 'true') {
        return null;
      }

      const credentialsData = await this.getSecureItem(STORAGE_KEYS.CREDENTIALS);
      if (!credentialsData) {
        return null;
      }

      return JSON.parse(credentialsData);
    } catch (error) {
      console.error('Error getting credentials:', error);
      await this.clearCredentials();
      return null;
    }
  }

  async clearCredentials(): Promise<void> {
    try {
      await this.deleteSecureItem(STORAGE_KEYS.CREDENTIALS);
      await this.deleteSecureItem(STORAGE_KEYS.REMEMBER_ME);
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }

  async isRememberMeEnabled(): Promise<boolean> {
    try {
      const rememberMe = await this.getSecureItem(STORAGE_KEYS.REMEMBER_ME);
      return rememberMe === 'true';
    } catch (error) {
      return false;
    }
  }

  async saveBiometricPreferences(preferences: BiometricPreferences): Promise<void> {
    try {
      await this.setSecureItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving biometric preferences:', error);
      throw new Error('No se pudieron guardar las preferencias biométricas');
    }
  }

  async getBiometricPreferences(): Promise<BiometricPreferences | null> {
    try {
      const preferencesData = await this.getSecureItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES);
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
      await this.deleteSecureItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES);
    } catch (error) {
      console.error('Error clearing biometric preferences:', error);
    }
  }
}

export const secureStorageService = new SecureStorageService();