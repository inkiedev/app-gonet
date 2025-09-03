import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  CREDENTIALS: 'secure_credentials',
  REMEMBER_ME: 'remember_me',
  BIOMETRIC_PREFERENCES: 'biometric_preferences',
  USER_DATA: 'user_data',
  THEME_PREFERENCES: 'theme_preferences',
};

const MASTER_KEY_NAME = 'gonet_master_encryption_key';

export interface StoredCredentials {
  uid: number;
  username: string;
  password: string;
}

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

export interface ThemePreferences {
  isDark: boolean;
  followSystem: boolean;
}

class SecureStorageService {
  private masterKey: string | null = null;

  private async getMasterKey(): Promise<string> {
    if (this.masterKey) {
      return this.masterKey;
    }

    if (Platform.OS === 'web') {
      let masterKey = localStorage.getItem(MASTER_KEY_NAME);
      if (!masterKey) {
        masterKey = await this.generateMasterKey();
        localStorage.setItem(MASTER_KEY_NAME, masterKey);
      }
      this.masterKey = masterKey;
      return masterKey;
    } else {
      let masterKey = await SecureStore.getItemAsync(MASTER_KEY_NAME);
      if (!masterKey) {
        masterKey = await this.generateMasterKey();
        await SecureStore.setItemAsync(MASTER_KEY_NAME, masterKey);
      }
      this.masterKey = masterKey;
      return masterKey;
    }
  }

  private async generateMasterKey(): Promise<string> {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async encrypt(data: string): Promise<string> {
    const masterKey = await this.getMasterKey();
    const dataBytes = new TextEncoder().encode(data);
    const keyBytes = new Uint8Array(masterKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    const iv = await Crypto.getRandomBytesAsync(16);
    const encrypted = new Uint8Array(dataBytes.length);
    
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length] ^ iv[i % iv.length];
    }
    
    const combined = new Uint8Array(iv.length + encrypted.length);
    combined.set(iv, 0);
    combined.set(encrypted, iv.length);
    
    return Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async decrypt(encryptedData: string): Promise<string> {
    const masterKey = await this.getMasterKey();
    const keyBytes = new Uint8Array(masterKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    const combined = new Uint8Array(encryptedData.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length] ^ iv[i % iv.length];
    }
    
    return new TextDecoder().decode(decrypted);
  }

  private async setSecureItem(key: string, value: string): Promise<void> {
    const encryptedValue = await this.encrypt(value);
    await AsyncStorage.setItem(key, encryptedValue);
  }

  private async getSecureItem(key: string): Promise<string | null> {
    const encryptedValue = await AsyncStorage.getItem(key);
    if (!encryptedValue) return null;
    try {
      return await this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  private async deleteSecureItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      
      if (Platform.OS === 'web') {
        localStorage.removeItem(MASTER_KEY_NAME);
      } else {
        await SecureStore.deleteItemAsync(MASTER_KEY_NAME);
      }
      
      this.masterKey = null;
    } catch (error) {
      console.error('Error clearing all data:', error);
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

  async saveUserData(userData: UserData): Promise<void> {
    try {
      await this.setSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('No se pudieron guardar los datos del usuario');
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userDataString = await this.getSecureItem(STORAGE_KEYS.USER_DATA);
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
      await this.deleteSecureItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  async saveThemePreferences(preferences: ThemePreferences): Promise<void> {
    try {
      await this.setSecureItem(STORAGE_KEYS.THEME_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving theme preferences:', error);
      throw new Error('No se pudieron guardar las preferencias de tema');
    }
  }

  async getThemePreferences(): Promise<ThemePreferences | null> {
    try {
      const preferencesData = await this.getSecureItem(STORAGE_KEYS.THEME_PREFERENCES);
      if (!preferencesData) {
        return null;
      }
      return JSON.parse(preferencesData);
    } catch (error) {
      console.error('Error getting theme preferences:', error);
      return null;
    }
  }

  async clearThemePreferences(): Promise<void> {
    try {
      await this.deleteSecureItem(STORAGE_KEYS.THEME_PREFERENCES);
    } catch (error) {
      console.error('Error clearing theme preferences:', error);
    }
  }
}

export const secureStorageService = new SecureStorageService();