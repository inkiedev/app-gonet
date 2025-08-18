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
    session_id: string;
  };
  error?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  uid: number;
  session_id: string;
}

export class AuthService {
  private defaultDatabase = 'gonet_db';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const database = credentials.database || this.defaultDatabase;
      
      // Authenticate user
      const authResult: OdooAuthResult = await apiService.login(
        database,
        credentials.username,
        credentials.password
      );

      if (!authResult.uid || !authResult.session_id) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // Get user data
      const userData: OdooUserData[] = await apiService.getUserData(
        database,
        authResult.uid,
        credentials.password,
        authResult.uid
      );

      if (!userData || userData.length === 0) {
        return {
          success: false,
          error: 'No se pudo obtener información del usuario'
        };
      }

      const user = userData[0];
      
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email || '',
          uid: authResult.uid,
          session_id: authResult.session_id
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
    // Clear stored session data
    // In a real implementation, you might want to call an API endpoint
    // or clear stored tokens/session data
  }
}

export const authService = new AuthService();