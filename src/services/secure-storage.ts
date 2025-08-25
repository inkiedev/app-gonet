import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  MASTER_KEY: 'master_encryption_key',
  CREDENTIALS: 'encrypted_credentials',
  REMEMBER_ME: 'remember_me_flag',
  BIOMETRIC_PREFERENCES: 'encrypted_biometric_preferences',
  USER_DATA: 'encrypted_user_data',
};

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

class SecureStorageService {
  private generateMasterKey(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  private async getMasterKey(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(STORAGE_KEYS.MASTER_KEY);
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.MASTER_KEY);
    }
  }

  private async setMasterKey(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(STORAGE_KEYS.MASTER_KEY, key);
    } else {
      await SecureStore.setItemAsync(STORAGE_KEYS.MASTER_KEY, key);
    }
  }

  private async deleteMasterKey(): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(STORAGE_KEYS.MASTER_KEY);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.MASTER_KEY);
    }
  }

  private async encrypt(data: string): Promise<string> {
    const masterKey = await this.getMasterKey();
    if (!masterKey) {
      throw new Error('Master key not found');
    }
    return CryptoJS.AES.encrypt(data, masterKey).toString();
  }

  private async decrypt(encryptedData: string): Promise<string> {
    const masterKey = await this.getMasterKey();
    if (!masterKey) {
      throw new Error('Master key not found');
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, masterKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private async setEncryptedItem(key: string, value: string): Promise<void> {
    const encryptedValue = await this.encrypt(value);
    await AsyncStorage.setItem(key, encryptedValue);
  }

  private async getEncryptedItem(key: string): Promise<string | null> {
    const encryptedValue = await AsyncStorage.getItem(key);
    if (!encryptedValue) return null;
    try {
      return await this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  private async deleteEncryptedItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async saveCredentials(credentials: StoredCredentials, rememberMe: boolean): Promise<void> {
    try {
      if (rememberMe) {
        let masterKey = await this.getMasterKey();
        if (!masterKey) {
          masterKey = this.generateMasterKey();
          await this.setMasterKey(masterKey);
        }
        
        await this.setEncryptedItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
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
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      if (rememberMe !== 'true') {
        return null;
      }

      const masterKey = await this.getMasterKey();
      if (!masterKey) {
        return null;
      }

      const credentialsData = await this.getEncryptedItem(STORAGE_KEYS.CREDENTIALS);
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
      await this.deleteEncryptedItem(STORAGE_KEYS.CREDENTIALS);
      await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      await this.deleteMasterKey();
    } catch (error) {
      console.error('Error clearing credentials:', error);
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
      const masterKey = await this.getMasterKey();
      if (!masterKey) {
        throw new Error('Master key not found');
      }
      await this.setEncryptedItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving biometric preferences:', error);
      throw new Error('No se pudieron guardar las preferencias biométricas');
    }
  }

  async getBiometricPreferences(): Promise<BiometricPreferences | null> {
    try {
      const masterKey = await this.getMasterKey();
      if (!masterKey) {
        return null;
      }
      const preferencesData = await this.getEncryptedItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES);
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
      await this.deleteEncryptedItem(STORAGE_KEYS.BIOMETRIC_PREFERENCES);
    } catch (error) {
      console.error('Error clearing biometric preferences:', error);
    }
  }

  async saveUserData(userData: UserData): Promise<void> {
    try {
      const masterKey = await this.getMasterKey();
      if (!masterKey) {
        throw new Error('Master key not found');
      }
      await this.setEncryptedItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('No se pudieron guardar los datos del usuario');
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const masterKey = await this.getMasterKey();
      if (!masterKey) {
        return null;
      }
      const userDataString = await this.getEncryptedItem(STORAGE_KEYS.USER_DATA);
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
      await this.deleteEncryptedItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}

export const secureStorageService = new SecureStorageService();