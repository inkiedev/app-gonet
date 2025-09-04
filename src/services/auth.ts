import { Subscription } from '../types/subscription';
import { apiService, OdooAuthResult, OdooJsonRegisterRpcRequest } from './api';

export interface LoginRequest {
  username: string;
  password: string;
  database?: string;
}


export interface RegisterRequest {
    vat: string;

}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    uid: number;
  };
  subscriptions?: Subscription[];
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}



export interface AuthUser {
  id: number;
  name: string;
  email: string;
  uid: number;
}


export class AuthService {
  private defaultDatabase = 'enterprise';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const database = credentials.database || this.defaultDatabase;
      
      const authResult: OdooAuthResult = await apiService.login(
        database,
        credentials.username,
        credentials.password
      );

      if (!authResult.uid) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // Obtener suscripciones usando el username como DNI
      const subscriptions: Subscription[] = await apiService.getSuscription(
        database,
        credentials.username
      );

      if (!subscriptions || subscriptions.length === 0) {
        return {
          success: false,
          error: 'No se encontraron suscripciones para este usuario'
        };
      }

      // Extraer datos del usuario del primer partner en las suscripciones
      const firstPartner = subscriptions[0].partner;
      if (!firstPartner) {
        return {
          success: false,
          error: 'No se pudo obtener información del usuario'
        };
      }

      // Guardar suscripciones en storage seguro
      const { secureStorageService } = await import('./secure-storage');
      await secureStorageService.saveSubscriptions(subscriptions);
      await secureStorageService.saveSelectedAccountIndex(0); // Primera cuenta por defecto

      return {
        success: true,
        user: {
          id: firstPartner.id,
          name: firstPartner.name,
          email: firstPartner.email,
          uid: authResult.uid
        },
        subscriptions: subscriptions
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión'
      };
    }
  }

  async validatePassword(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const database = credentials.database || this.defaultDatabase;
      
      const authResult: OdooAuthResult = await apiService.login(
        database,
        credentials.username,
        credentials.password
      );
      console.log("validatepaswd auths: ",authResult)
      return {
        success: !!authResult.uid,
        error: authResult.uid ? undefined : 'Contraseña incorrecta'
      };

    } catch (error) {
      console.error('Password validation error:', error);
      return {
        success: false,
        error: 'Error al validar la contraseña'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const { secureStorageService } = await import('./secure-storage');
      await secureStorageService.clearCredentials();
      await secureStorageService.clearUserData();
      await secureStorageService.clearBiometricPreferences();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Error during logout');
    }
  }



  async register(credentials: RegisterRequest): Promise<OdooJsonRegisterRpcRequest> {
  try {
    const database = this.defaultDatabase;

    // Llamada al método del API de Odoo para registrar por cédula (VAT)
    const response: OdooJsonRegisterRpcRequest = await apiService.createUser(
      database,
      credentials.vat // argumentos
    );

    // Retorna el resultado tal cual lo devuelve Odoo
    return response
      
    ;

  } catch (error) {
    console.error('Register error on auth.ts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión'
    };
  }
}

  async changePassword(new_password: string): Promise<any> {
    try {
      const { secureStorageService } = await import('./secure-storage');
      const credentials = await secureStorageService.getCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }

      const database = this.defaultDatabase;
      const { uid, password } = credentials;

      const result = await apiService.changePassword(database, uid, password, new_password);

      return {
        success: true,
        result
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error changing password'
      };
    }
  }
  
}

export const authService = new AuthService();