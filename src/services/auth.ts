import { apiService, OdooAuthResult, OdooUserData } from './api';

export interface LoginRequest {
  username: string;
  password: string;
  database?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    uid: number;
  };
  error?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  uid: number;
}


export class AuthService {
  private defaultDatabase = 'app';

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

      const userData: OdooUserData = await apiService.getUserData(
        database,
        authResult.uid,
        credentials.password
      );

      if (!userData) {
        return {
          success: false,
          error: 'No se pudo obtener información del usuario'
        };
      }
      
      return {
        success: true,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email || '',
          uid: authResult.uid
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const { secureStorageService } = await import('./secure-storage');
      await secureStorageService.clearCredentials();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Error during logout');
    }
  }
}

export const authService = new AuthService();