import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< HEAD
=======
import * as Crypto from 'expo-crypto';
>>>>>>> f18f105ae7565e2d0c753688ffe5769c3acdbff7
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  REMEMBER_ME: 'remember_me',
  BIOMETRIC_PREFERENCES: 'biometric_preferences',
  USER_DATA: 'user_data',
  SESSION_ID: 'session_id',
  USERNAME: 'username',
};

<<<<<<< HEAD
=======
const MASTER_KEY_NAME = 'gonet_master_encryption_key';

export interface StoredCredentials {
  uid: number;
  username: string;
  password: string;
}

>>>>>>> f18f105ae7565e2d0c753688ffe5769c3acdbff7
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
<<<<<<< HEAD
  private async setSecureItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
=======
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
>>>>>>> f18f105ae7565e2d0c753688ffe5769c3acdbff7
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
<<<<<<< HEAD
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
=======
    const encryptedValue = await AsyncStorage.getItem(key);
    if (!encryptedValue) return null;
    try {
      return await this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
>>>>>>> f18f105ae7565e2d0c753688ffe5769c3acdbff7
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