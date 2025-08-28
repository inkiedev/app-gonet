import { apiService, OdooAuthResult, OdooSessionResult, OdooJsonRegisterRpcRequest, OdooUserData } from './api';

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
  private defaultDatabase = 'enterprise';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const database = credentials.database || this.defaultDatabase;
      
      // Usar el nuevo sistema de autenticación con sesión
      const sessionResult: OdooSessionResult = await apiService.loginWithSession(
        database,
        credentials.username,
        credentials.password
      );

      if (!sessionResult.uid || !sessionResult.session_id) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // Guardar el session_id para futuras consultas
      const { secureStorageService } = await import('./secure-storage');
      await secureStorageService.saveSessionId(sessionResult.session_id);

      const userData: OdooUserData = await apiService.getUserData(
        database,
        sessionResult.uid
      );

      if (!userData) {
        return {
          success: false,
          error: 'No se pudo obtener información del usuario'
        };
      }

      await secureStorageService.saveUserData(userData);

      return {
        success: true,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email || '',
          uid: sessionResult.uid
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
      await secureStorageService.clearAll();
      apiService.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Error during logout');
    }
  }

  async restoreSession(): Promise<{ success: boolean; userData?: any; username?: string; error?: string }> {
    try {
      const { secureStorageService } = await import('./secure-storage');
      
      // Verificar si está habilitado el recuérdame
      const rememberData = await secureStorageService.getRememberMe();
      if (!rememberData.rememberMe || !rememberData.username) {
        return { success: false, error: 'Remember me not enabled' };
      }

      // Verificar si hay session_id guardado
      const sessionId = await secureStorageService.getSessionId();
      if (!sessionId) {
        return { success: false, error: 'No saved session found' };
      }

      // Restaurar session_id en el API service
      apiService.setSessionId(sessionId);

      // Verificar si la sesión sigue siendo válida intentando obtener datos del usuario
      const userData = await secureStorageService.getUserData();
      if (!userData) {
        return { success: false, error: 'No user data found' };
      }

      // Intentar una llamada de prueba para verificar que la sesión es válida
      try {
        await apiService.getUserData(this.defaultDatabase, userData.id);
        return { 
          success: true, 
          userData, 
          username: rememberData.username 
        };
      } catch (error) {
        // Si la sesión expiró, limpiar datos de sesión pero mantener preferencias
        await secureStorageService.clearSessionId();
        apiService.clearSession();
        return { 
          success: false, 
          error: 'Session expired', 
          username: rememberData.username 
        };
      }

    } catch (error) {
      console.error('Session restore error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error restoring session' 
      };
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
      
      // Verificar que hay una sesión activa
      const sessionId = await secureStorageService.getSessionId();
      if (!sessionId) {
        throw new Error('No active session found');
      }

      // Obtener datos del usuario para el uid
      const userData = await secureStorageService.getUserData();
      if (!userData) {
        throw new Error('No user data found');
      }

      // El session_id ya está configurado en apiService
      apiService.setSessionId(sessionId);
      
      const database = this.defaultDatabase;
      const result = await apiService.changePassword(database, userData.id, new_password);

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