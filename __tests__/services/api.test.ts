import { apiService } from '@/services/api';

global.fetch = jest.fn();

describe('ApiService', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should make successful login request', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: { uid: 123, session_id: 'abc123' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.login('test_db', 'user', 'password');

      expect(result).toEqual({ uid: 123, session_id: 'abc123' });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/jsonrpc'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test_db')
        })
      );
    });

    it('should throw error when database is missing', async () => {
      await expect(apiService.login('', 'user', 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login(null as any, 'user', 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login(undefined as any, 'user', 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('   ', 'user', 'password')).rejects.toThrow('Database, username and password are required');
    });

    it('should throw error when username is missing', async () => {
      await expect(apiService.login('db', '', 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', null as any, 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', undefined as any, 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', '   ', 'password')).rejects.toThrow('Database, username and password are required');
    });

    it('should throw error when password is missing', async () => {
      await expect(apiService.login('db', 'user', '')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', 'user', null as any)).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', 'user', undefined as any)).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', 'user', '   ')).rejects.toThrow('Database, username and password are required');
    });

    it('should throw error when parameters have invalid types', async () => {
      await expect(apiService.login(123 as any, 'user', 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', 123 as any, 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', 'user', 123 as any)).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login({} as any, 'user', 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', {} as any, 'password')).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login('db', 'user', {} as any)).rejects.toThrow('Database, username and password are required');
      await expect(apiService.login([] as any, 'user', 'password')).rejects.toThrow('Database, username and password are required');
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: { code: -1, message: 'Invalid credentials' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('test_db', 'wrong', 'password')).rejects.toThrow('Invalid credentials');
    });

    it('should handle API errors without message', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: { code: -1 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('API Error');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle invalid response format', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: null
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('Invalid login response');
    });

    it('should handle non-object response results', async () => {
      const responses = [
        { jsonrpc: '2.0', id: 1, result: 'string' },
        { jsonrpc: '2.0', id: 1, result: 12345 },
        { jsonrpc: '2.0', id: 1, result: [] },
        { jsonrpc: '2.0', id: 1, result: undefined }
      ];

      for (const mockResponse of responses) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('Invalid login response');
        mockFetch.mockClear();
      }
    });

    it('should handle Odoo specific errors', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: { 
          code: 100,
          message: 'AccessDenied: Wrong login/password'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('AccessDenied: Wrong login/password');
    });

    it('should handle special characters in credentials', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: { uid: 456, session_id: 'def456' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.login('test_db', 'user@domain.com', 'p@ssw0rd!');
      expect(result).toEqual({ uid: 456, session_id: 'def456' });
    });
  });

  describe('getUserData', () => {
    it('should fetch user data successfully', async () => {
      const mockUserData = [{ id: 1, name: 'Test User', email: 'test@example.com' }];
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: mockUserData
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.getUserData('test_db', 123, 'password', 1);

      expect(result).toEqual(mockUserData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/jsonrpc'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('res.users')
        })
      );
    });

    it('should throw error when database is invalid', async () => {
      await expect(apiService.getUserData('', 123, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData(null as any, 123, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('   ', 123, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
    });

    it('should throw error when uid is invalid', async () => {
      await expect(apiService.getUserData('db', 0, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', -1, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', 123.5, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', '123' as any, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', null as any, 'password', 1)).rejects.toThrow('Database, uid, password and userId are required');
    });

    it('should throw error when password is invalid', async () => {
      await expect(apiService.getUserData('db', 123, '', 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', 123, null as any, 1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', 123, '   ', 1)).rejects.toThrow('Database, uid, password and userId are required');
    });

    it('should throw error when userId is invalid', async () => {
      await expect(apiService.getUserData('db', 123, 'password', 0)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', 123, 'password', -1)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', 123, 'password', '1' as any)).rejects.toThrow('Database, uid, password and userId are required');
      await expect(apiService.getUserData('db', 123, 'password', null as any)).rejects.toThrow('Database, uid, password and userId are required');
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.getUserData('test_db', 123, 'password', 1);
      expect(result).toEqual([]);
    });

    it('should handle null results', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: null
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.getUserData('test_db', 123, 'password', 1);
      expect(result).toEqual([]);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.updateUserProfile('test_db', 123, 'password', 1, { name: 'New Name' });

      expect(result).toBe(true);
    });

    it('should throw error when data is not an object', async () => {
      await expect(apiService.updateUserProfile('db', 123, 'password', 1, 'invalid')).rejects.toThrow('Data must be an object');
      await expect(apiService.updateUserProfile('db', 123, 'password', 1, [])).rejects.toThrow('Data must be an object');
      await expect(apiService.updateUserProfile('db', 123, 'password', 1, 123)).rejects.toThrow('Data must be an object');
    });

    it('should throw error when parameters are invalid', async () => {
      await expect(apiService.updateUserProfile('', 123, 'password', 1, {})).rejects.toThrow('All parameters are required');
      await expect(apiService.updateUserProfile('db', 0, 'password', 1, {})).rejects.toThrow('All parameters are required');
      await expect(apiService.updateUserProfile('db', 123, '', 1, {})).rejects.toThrow('All parameters are required');
      await expect(apiService.updateUserProfile('db', 123, 'password', 0, {})).rejects.toThrow('All parameters are required');
      await expect(apiService.updateUserProfile('db', 123, 'password', 1, null)).rejects.toThrow('All parameters are required');
    });

    it('should handle empty object data', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.updateUserProfile('test_db', 123, 'password', 1, {});
      expect(result).toBe(true);
    });

    it('should handle false result', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.updateUserProfile('test_db', 123, 'password', 1, { name: 'test' });
      expect(result).toBe(false);
    });

    it('should handle complex nested data', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const complexData = {
        name: 'Test User',
        contact: {
          email: 'test@example.com',
          phone: '123-456-7890'
        },
        preferences: {
          language: 'es',
          timezone: 'UTC'
        }
      };

      const result = await apiService.updateUserProfile('test_db', 123, 'password', 1, complexData);
      expect(result).toBe(true);
    });
  });

  describe('searchUsers', () => {
    it('should search users successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: [1, 2, 3]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.searchUsers('test_db', 123, 'password', []);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle default empty domain', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: [1, 2, 3, 4, 5]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.searchUsers('test_db', 123, 'password');

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should throw error when domain is not an array', async () => {
      await expect(apiService.searchUsers('db', 123, 'password', 'invalid' as any)).rejects.toThrow('Domain must be an array');
      await expect(apiService.searchUsers('db', 123, 'password', {} as any)).rejects.toThrow('Domain must be an array');
      await expect(apiService.searchUsers('db', 123, 'password', 123 as any)).rejects.toThrow('Domain must be an array');
    });

    it('should throw error when parameters are invalid', async () => {
      await expect(apiService.searchUsers('', 123, 'password')).rejects.toThrow('Database, uid and password are required');
      await expect(apiService.searchUsers('db', 0, 'password')).rejects.toThrow('Database, uid and password are required');
      await expect(apiService.searchUsers('db', 123, '')).rejects.toThrow('Database, uid and password are required');
    });

    it('should handle complex search domains', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: [10, 20, 30]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const complexDomain = [
        ['active', '=', true],
        ['|'],
        ['name', 'ilike', 'admin'],
        ['email', 'ilike', 'admin']
      ];

      const result = await apiService.searchUsers('test_db', 123, 'password', complexDomain);
      expect(result).toEqual([10, 20, 30]);
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.searchUsers('test_db', 123, 'password', [['name', '=', 'nonexistent']]);
      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: 456
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.createUser('test_db', 123, 'password', { name: 'New User', email: 'new@example.com' });

      expect(result).toBe(456);
    });

    it('should throw error when userData is not an object', async () => {
      await expect(apiService.createUser('db', 123, 'password', 'invalid')).rejects.toThrow('User data must be an object');
      await expect(apiService.createUser('db', 123, 'password', [])).rejects.toThrow('User data must be an object');
      await expect(apiService.createUser('db', 123, 'password', 123)).rejects.toThrow('User data must be an object');
    });

    it('should throw error when parameters are invalid', async () => {
      await expect(apiService.createUser('', 123, 'password', {})).rejects.toThrow('All parameters are required');
      await expect(apiService.createUser('db', 0, 'password', {})).rejects.toThrow('All parameters are required');
      await expect(apiService.createUser('db', 123, '', {})).rejects.toThrow('All parameters are required');
      await expect(apiService.createUser('db', 123, 'password', null)).rejects.toThrow('All parameters are required');
    });

    it('should handle complex user data', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: 789
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const complexUserData = {
        name: 'Test User',
        login: 'testuser',
        email: 'test@example.com',
        phone: '123-456-7890',
        groups_id: [[6, 0, [1, 2, 3]]],
        company_ids: [[6, 0, [1]]],
        tz: 'UTC',
        lang: 'en_US',
        active: true
      };

      const result = await apiService.createUser('test_db', 123, 'password', complexUserData);
      expect(result).toBe(789);
    });

    it('should handle user data with special characters', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: 999
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const userDataWithSpecialChars = {
        name: 'José María González-Pérez',
        login: 'jmgp@test.com',
        email: 'josé.maría@test-company.com'
      };

      const result = await apiService.createUser('test_db', 123, 'password', userDataWithSpecialChars);
      expect(result).toBe(999);
    });
  });

  describe('Network and HTTP Errors', () => {
    it('should handle different HTTP status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503];
      
      for (const status of statusCodes) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status,
          statusText: `Error ${status}`
        } as Response);

        await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow(`HTTP ${status}: Error ${status}`);
        mockFetch.mockClear();
      }
    });

    it('should handle network timeouts', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fetch timeout'));

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('fetch timeout');
    });

    it('should handle DNS resolution errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND'));

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('getaddrinfo ENOTFOUND');
    });

    it('should handle connection refused errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('connect ECONNREFUSED'));

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('connect ECONNREFUSED');
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new SyntaxError('Unexpected token in JSON'); }
      } as unknown as Response);

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('Unexpected token in JSON');
    });

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Unexpected end of JSON input'); }
      } as unknown as Response);

      await expect(apiService.login('test_db', 'user', 'password')).rejects.toThrow('Unexpected end of JSON input');
    });
  });
});