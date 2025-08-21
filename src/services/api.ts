interface OdooAuthResult {
  uid: number;
}

interface OdooUserData {
  id: number;
  login: string;
  name: string;
  email: string;
  active: boolean;
  partner_id: number;
  partner_name: string;
  partner_email: string;
  partner_vat: string;
}

interface OdooJsonRpcRequest {
  jsonrpc: string;
  method: string;
  params: any;
  id: number;
}

interface OdooJsonRegisterRpcRequest{
error? : string;
success: string;
message?: string;
destinatary?: string;
signup_url?: string;
}


interface OdooJsonRpcResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

class ApiService {
  private baseUrl: string;
  private requestId: number = 1;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeJsonRpcRequest(method: string, params: any = {}): Promise<any> {
    const request: OdooJsonRpcRequest = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this.requestId++
    };

    const response = await fetch(`${this.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: OdooJsonRpcResponse = await response.json();

    if (data.error) {
      console.log("error de datos")
      throw new Error(data.error.message || 'API Error');
    }

    return data.result;
  }

  async login(database: string, username: string, password: string): Promise<OdooAuthResult> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !username || typeof username !== 'string' || username.trim() === '' ||
        !password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('Database, username and password are required');
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'common',
      method: 'authenticate',
      args: [database, username, password, {}]
    });

    if (!result || typeof result !== 'number') {
      throw new Error('Invalid login response');
    }

    return { uid: result };
  }

  async getUserData(database: string, uid: number, password: string): Promise<OdooUserData> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !uid || typeof uid !== 'number' || uid <= 0 || !Number.isInteger(uid) ||
        !password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('Database, uid and password are required');
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute_kw',
      args: [database, uid, password, 'my.app.api', 'get_user_data', [uid]]
    });

    if (!result || typeof result !== 'object') {
      throw new Error('Invalid user data response');
    }

    return result;
  }

  async updateUserProfile(database: string, uid: number, password: string, userId: number, data: any): Promise<boolean> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !uid || typeof uid !== 'number' || uid <= 0 || !Number.isInteger(uid) ||
        !password || typeof password !== 'string' || password.trim() === '' ||
        !userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId) ||
        data == null) {
      throw new Error('All parameters are required');
    }

    if (typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Data must be an object');
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute_kw',
      args: [database, uid, password, 'res.users', 'write', [userId, data]]
    });

    return result === true;
  }

  async searchUsers(database: string, uid: number, password: string, domain: any[] = []): Promise<number[]> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !uid || typeof uid !== 'number' || uid <= 0 || !Number.isInteger(uid) ||
        !password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('Database, uid and password are required');
    }

    if (!Array.isArray(domain)) {
      throw new Error('Domain must be an array');
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute_kw',
      args: [database, uid, password, 'res.users', 'search', [domain]]
    });

    return result || [];
  }

  async createUser(database: string, vat: string): Promise<OdooJsonRegisterRpcRequest> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !vat || typeof vat !== 'string' || vat.trim() === '' 
        
        
        ) {
      throw new Error('All parameters are required');
    }

    

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute',
      args: [database, 2, 'admin', 'my.app.api', 'request_registration',vat]
    });


    return result;
  }
}

export const apiService = new ApiService(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8069'
);

export type { OdooAuthResult, OdooJsonRegisterRpcRequest, OdooJsonRpcResponse, OdooUserData };

