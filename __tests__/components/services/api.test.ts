import { apiService } from '@/services/api';

global.fetch = jest.fn();

describe('ApiService', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should make successful login request', async () => {
      const mockResponse = { result: { uid: 123, session_id: 'abc123' } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.login('testuser', 'testpass');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/jsonrpc'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('common'),
        })
      );
      expect(result).toEqual({ uid: 123, session_id: 'abc123' });
    });

    it('should handle empty username', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Username is required' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('', 'password')).rejects.toThrow('Username is required');
    });

    it('should handle empty password', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Password is required' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('username', '')).rejects.toThrow('Password is required');
    });

    it('should handle both empty fields', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Username and password are required' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('', '')).rejects.toThrow('Username and password are required');
    });

    it('should handle null/undefined username', async () => {
      const mockResponse = {
       error: { code: -32602, message: 'Invalid credentials format' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login(null as any, 'password')).rejects.toThrow('Invalid credentials format');
    });

    it('should handle invalid credentials', async () => {
      const mockResponse = {
        error: { code: -32000, message: 'Invalid username or password' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('wrong', 'creds')).rejects.toThrow('Invalid username or password');
    });

    it('should handle database connection error', async () => {
      const mockResponse = {
        error: { code: -32001, message: 'Database connection failed' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('user', 'pass')).rejects.toThrow('Database connection failed');
    });

    it('should handle special characters in credentials', async () => {
      const mockResponse = { result: { uid: 456, session_id: 'def456' } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.login('user@domain.com', 'p@ssw0rd!');
      expect(result).toEqual({ uid: 456, session_id: 'def456' });
    });
  });

  describe('getUserData', () => {
    it('should fetch user data successfully', async () => {
      const mockUserData = { id: 1, name: 'Test User', email: 'test@example.com' };
      const mockResponse = { result: [mockUserData] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.getUserData(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/jsonrpc'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('res.users'),
        })
      );
      expect(result).toEqual([mockUserData]);
    });

    it('should handle invalid user ID (negative)', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Invalid user ID' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.getUserData(-1)).rejects.toThrow('Invalid user ID');
    });

    it('should handle invalid user ID (zero)', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'User ID must be greater than 0' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.getUserData(0)).rejects.toThrow('User ID must be greater than 0');
    });

    it('should handle non-existent user', async () => {
      const mockResponse = {
        error: { code: -32404, message: 'User not found' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.getUserData(999999)).rejects.toThrow('User not found');
    });

    it('should handle null/undefined user ID', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'User ID is required' }
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.getUserData(null as any)).rejects.toThrow('User ID is required');
      await expect(apiService.getUserData(undefined as any)).rejects.toThrow('User ID is required');
    });

    it('should handle string user ID', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'User ID must be a number' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.getUserData('123' as any)).rejects.toThrow('User ID must be a number');
    });

    it('should handle access denied', async () => {
      const mockResponse = {
        error: { code: -32403, message: 'Access denied' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.getUserData(2)).rejects.toThrow('Access denied');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const mockResponse = { result: true };
      const updateData = { name: 'Updated Name', email: 'updated@example.com' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.updateUserProfile(1, updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/jsonrpc'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('write'),
        })
      );
      expect(result).toBe(true);
    });

    it('should handle empty update data', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Update data cannot be empty' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.updateUserProfile(1, {})).rejects.toThrow('Update data cannot be empty');
    });

    it('should handle null update data', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Update data is required' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      console.log('mockFetch antes de la llamada:', mockFetch.mock.calls.length);

      await expect(apiService.updateUserProfile(1, null)).rejects.toThrow('Update data is required');
    });

    it('should handle invalid field names', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Invalid field: invalid_field' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.updateUserProfile(1, { invalid_field: 'value' })).rejects.toThrow('Invalid field: invalid_field');
    });

    it('should handle invalid email format', async () => {
      const mockResponse = {
        error: { code: -32602, message: 'Invalid email format' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.updateUserProfile(1, { email: 'invalid-email' })).rejects.toThrow('Invalid email format');
    });

    it('should handle duplicate email', async () => {
      const mockResponse = {
        error: { code: -32409, message: 'Email already exists' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.updateUserProfile(1, { email: 'existing@example.com' })).rejects.toThrow('Email already exists');
    });

    it('should handle permission denied for updating other users', async () => {
      const mockResponse = {
        error: { code: -32403, message: 'Permission denied: Cannot update other users' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.updateUserProfile(999, { name: 'Hacker' })).rejects.toThrow('Permission denied: Cannot update other users');
    });
  });

  describe('makeRequest error handling', () => {
    it('should handle HTTP 400 Bad Request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      } as Response);

      await expect(apiService.login('user', 'pass')).rejects.toThrow('HTTP error! status: 400');
    });

    it('should handle HTTP 401 Unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      } as Response);

      await expect(apiService.getUserData(1)).rejects.toThrow('HTTP error! status: 401');
    });

    it('should handle HTTP 403 Forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      } as Response);

      await expect(apiService.updateUserProfile(1, { name: 'test' })).rejects.toThrow('HTTP error! status: 403');
    });

    it('should handle HTTP 404 Not Found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response);

      await expect(apiService.getUserData(999)).rejects.toThrow('HTTP error! status: 404');
    });

    it('should handle HTTP 500 Internal Server Error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(apiService.login('user', 'pass')).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle HTTP 503 Service Unavailable', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      } as Response);

      await expect(apiService.login('user', 'pass')).rejects.toThrow('HTTP error! status: 503');
    });

    it('should handle network timeout', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(apiService.login('user', 'pass')).rejects.toThrow('Request timeout');
    });

    it('should handle DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND'));

      await expect(apiService.login('user', 'pass')).rejects.toThrow('getaddrinfo ENOTFOUND');
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      } as Response);

      await expect(apiService.login('user', 'pass')).rejects.toThrow();
    });
  });

  describe('request ID increment', () => {
    it('should increment request ID for each request', async () => {
      const mockResponse = { result: 'success' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await apiService.login('user1', 'pass1');
      await apiService.login('user2', 'pass2');
      await apiService.getUserData(1);

      const calls = mockFetch.mock.calls;
      const firstCall = JSON.parse(calls[0][1]?.body as string);
      const secondCall = JSON.parse(calls[1][1]?.body as string);
      const thirdCall = JSON.parse(calls[2][1]?.body as string);

      expect(secondCall.id).toBe(firstCall.id + 1);
      expect(thirdCall.id).toBe(secondCall.id + 1);
    });

    it('should maintain unique request IDs across different methods', async () => {
      const mockResponse = { result: 'success' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const promises = [
        apiService.login('user', 'pass'),
        apiService.getUserData(1),
        apiService.updateUserProfile(1, { name: 'test' })
      ];

      await Promise.all(promises);

      const calls = mockFetch.mock.calls;
      const requestIds = calls.map(call => JSON.parse(call[1]?.body as string).id);

      // All IDs should be unique
      expect(new Set(requestIds).size).toBe(requestIds.length);
    });
  });

  describe('JSON-RPC protocol compliance', () => {
    it('should send proper JSON-RPC 2.0 request format', async () => {
      const mockResponse = { result: 'success' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await apiService.login('user', 'pass');

      const call = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(call[1]?.body as string);

      expect(requestBody).toMatchObject({
        jsonrpc: '2.0',
        method: 'call',
        params: expect.any(Object),
        id: expect.any(Number)
      });
    });

    it('should handle JSON-RPC error responses correctly', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32601,
          message: 'Method not found',
          data: { details: 'The requested method does not exist' }
        }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('user', 'pass')).rejects.toThrow('Method not found');
    });
  });
});