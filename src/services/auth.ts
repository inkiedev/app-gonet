import { apiService, OdooAuthResult, OdooJsonRegisterRpcRequest, OdooUserData } from './api';

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

      console.log(userData)
      
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

  async validatePassword(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const database = credentials.database || this.defaultDatabase;
      
      const authResult: OdooAuthResult = await apiService.login(
        database,
        credentials.username,
        credentials.password
      );

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
      success: "false",
      error: error instanceof Error ? error.message : 'Error de conexión'
    };
  }
}



  
}

export const authService = new AuthService();