import { authService } from '@/services/auth';

jest.mock('@/services/api', () => ({
  apiService: {
    login: jest.fn(),
    getUserData: jest.fn(),
    updateUserProfile: jest.fn(),
    searchUsers: jest.fn(),
    createUser: jest.fn(),
  }
}));

import { apiService } from '@/services/api';

describe('AuthService', () => {
  const mockApiService = apiService as jest.Mocked<typeof apiService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('successfully logs in with valid credentials', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: 'test-session-123'
      };
      
      const mockUserData = [{
        id: 1,
        name: 'Test User',
        email: 'test@gonet.com'
      }];

      mockApiService.login.mockResolvedValue(mockAuthResult);
      mockApiService.getUserData.mockResolvedValue(mockUserData);

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@gonet.com',
        uid: 1,
        session_id: 'test-session-123'
      });
      expect(result.error).toBeUndefined();

      expect(mockApiService.login).toHaveBeenCalledWith(
        'gonet_db',
        'testuser',
        'test123'
      );
      expect(mockApiService.getUserData).toHaveBeenCalledWith(
        'gonet_db',
        1,
        'test123',
        1
      );
    });

    it('uses custom database when provided', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: 'test-session-123'
      };
      
      const mockUserData = [{
        id: 1,
        name: 'Test User',
        email: 'test@gonet.com'
      }];

      mockApiService.login.mockResolvedValue(mockAuthResult);
      mockApiService.getUserData.mockResolvedValue(mockUserData);

      await authService.login({
        username: 'testuser',
        password: 'test123',
        database: 'custom_db'
      });

      expect(mockApiService.login).toHaveBeenCalledWith(
        'custom_db',
        'testuser',
        'test123'
      );
      expect(mockApiService.getUserData).toHaveBeenCalledWith(
        'custom_db',
        1,
        'test123',
        1
      );
    });

    it('handles authentication failure with invalid uid', async () => {
      const mockAuthResult = {
        uid: 0, // Invalid uid
        session_id: 'test-session-123'
      };

      mockApiService.login.mockResolvedValue(mockAuthResult);

      const result = await authService.login({
        username: 'wronguser',
        password: 'wrongpass'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales incorrectas');
      expect(result.user).toBeUndefined();

      expect(mockApiService.getUserData).not.toHaveBeenCalled();
    });

    it('handles authentication failure with missing session_id', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: '' // Empty session_id
      };

      mockApiService.login.mockResolvedValue(mockAuthResult);

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales incorrectas');
      expect(result.user).toBeUndefined();
    });

    it('handles user data retrieval failure', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: 'test-session-123'
      };

      mockApiService.login.mockResolvedValue(mockAuthResult);
      mockApiService.getUserData.mockResolvedValue([]); // No user data

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('No se pudo obtener información del usuario');
      expect(result.user).toBeUndefined();
    });

    it('handles user data retrieval returning null', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: 'test-session-123'
      };

      mockApiService.login.mockResolvedValue(mockAuthResult);
      mockApiService.getUserData.mockResolvedValue(null as any);

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('No se pudo obtener información del usuario');
      expect(result.user).toBeUndefined();
    });

    it('handles API login error', async () => {
      const errorMessage = 'Invalid credentials';
      mockApiService.login.mockRejectedValue(new Error(errorMessage));

      const result = await authService.login({
        username: 'wronguser',
        password: 'wrongpass'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.user).toBeUndefined();

      expect(mockApiService.getUserData).not.toHaveBeenCalled();
    });

    it('handles API getUserData error', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: 'test-session-123'
      };

      const errorMessage = 'Failed to fetch user data';
      mockApiService.login.mockResolvedValue(mockAuthResult);
      mockApiService.getUserData.mockRejectedValue(new Error(errorMessage));

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.user).toBeUndefined();
    });

    it('handles non-Error exceptions', async () => {
      mockApiService.login.mockRejectedValue('String error');

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión');
      expect(result.user).toBeUndefined();
    });

    it('handles user with missing email gracefully', async () => {
      const mockAuthResult = {
        uid: 1,
        session_id: 'test-session-123'
      };
      
      const mockUserData = [{
        id: 1,
        name: 'Test User'
      }];

      mockApiService.login.mockResolvedValue(mockAuthResult);
      mockApiService.getUserData.mockResolvedValue(mockUserData);

      const result = await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('');
      expect(result.user?.name).toBe('Test User');
    });

    it('logs errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      
      mockApiService.login.mockRejectedValue(error);

      await authService.login({
        username: 'testuser',
        password: 'test123'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Login error:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('completes without error', async () => {
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });
});