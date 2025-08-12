interface JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params: any;
  id: number;
}

interface JsonRpcResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

class ApiService {
  private baseUrl: string;
  private requestId = 1;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    method: string,
    params: any = {}
  ): Promise<T> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.requestId++,
    };

    try {
      const response = await fetch(`${this.baseUrl}/jsonrpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse: JsonRpcResponse<T> = await response.json();

      if (jsonResponse.error) {
        throw new Error(jsonResponse.error.message);
      }

      return jsonResponse.result!;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos específicos para tu app
  async login(username: string, password: string) {
    return this.makeRequest('call', {
      service: 'common',
      method: 'authenticate',
      args: ['database_name', username, password, {}],
    });
  }

  async getUserData(userId: number) {
    return this.makeRequest('call', {
      service: 'object',
      method: 'execute_kw',
      args: ['database_name', userId, 'password', 'res.users', 'read', [userId]],
    });
  }

  async updateUserProfile(userId: number, data: any) {
    return this.makeRequest('call', {
      service: 'object',
      method: 'execute_kw',
      args: ['database_name', userId, 'password', 'res.users', 'write', [userId, data]],
    });
  }
}

export const apiService = new ApiService(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8069'
);