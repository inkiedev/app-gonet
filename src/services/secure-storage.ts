import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  CREDENTIALS: 'secure_credentials',
  REMEMBER_ME: 'remember_me',
};

const ENCRYPTION_KEY = 'gonet_app_secure_key_2024';

export interface StoredCredentials {
  uid: number;
  username: string;
  password: string;
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
}

export const secureStorageService = new SecureStorageService();