interface OdooAuthResult {
  uid: number;
}

interface OdooSessionResult {
  session_id: string;
  uid?: number;
  username?: string;
}

interface OdooUserData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  phone: string;
  street: string;
  city: string;
  street2: string;
  vat: string;
}

interface OdooJsonRpcRequest {
  jsonrpc: string;
  method: string;
  params: any;
  id: number;
}

interface OdooJsonRegisterRpcRequest{
error? : string;
success: boolean;
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
  private sessionId: string | null = null;

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

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Agregar cookie de sesión si está disponible
    if (this.sessionId) {
      headers['Cookie'] = `session_id=${this.sessionId}`;
    }

    const response = await fetch(`${this.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: headers,
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

  private async makeSessionAuthRequest(database: string, username: string, password: string): Promise<OdooSessionResult> {
    const response = await fetch(`${this.baseUrl}/web/session/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params: {
          db: database,
          login: username,
          password: password
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Extraer session_id de las cookies de respuesta
    const setCookieHeader = response.headers.get('set-cookie');
    let sessionId = '';
    
    if (setCookieHeader) {
      const sessionMatch = setCookieHeader.match(/session_id=([^;]+)/);
      if (sessionMatch) {
        sessionId = sessionMatch[1];
      }
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Authentication Error');
    }

    return {
      session_id: sessionId,
      uid: data.result?.uid,
      username: data.result?.username
    };
  }

  private async makeDatasetCallKw(model: string, method: string, args: any[] = [], kwargs: any = {}): Promise<any> {
    if (!this.sessionId) {
      throw new Error('No active session. Please authenticate first.');
    }

    const response = await fetch(`${this.baseUrl}/web/dataset/call_kw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${this.sessionId}`
      },
      body: JSON.stringify({
        params: {
          model: model,
          method: method,
          args: args,
          kwargs: kwargs
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    return data.result;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  clearSession(): void {
    this.sessionId = null;
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

    console.log(result)
    if (!result || typeof result !== 'number') {
      throw new Error('Invalid login response');
    }

    return { uid: result };
  }

  async loginWithSession(database: string, username: string, password: string): Promise<OdooSessionResult> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !username || typeof username !== 'string' || username.trim() === '' ||
        !password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('Database, username and password are required');
    }

    const sessionResult = await this.makeSessionAuthRequest(database, username, password);
    
    if (!sessionResult.session_id || !sessionResult.uid) {
      throw new Error('Invalid session authentication response');
    }

    // Establecer el session_id para futuras llamadas
    this.sessionId = sessionResult.session_id;

    return sessionResult;
  }

  async getUserData(database: string, uid: number): Promise<OdooUserData> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !uid || typeof uid !== 'number' || uid <= 0 || !Number.isInteger(uid)) {
      throw new Error('Database and uid are required');
    }

    if (!this.sessionId) {
      throw new Error('No active session. Please authenticate first.');
    }

    const result = await this.makeDatasetCallKw('my.app.api', 'get_user_data', [uid]);

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Invalid user data response');
    }

    return result[0];
  }

  async updateUserProfile(database: string, userId: number, data: any): Promise<boolean> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId) ||
        data == null) {
      throw new Error('Database, userId and data are required');
    }

    if (typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Data must be an object');
    }

    if (!this.sessionId) {
      throw new Error('No active session. Please authenticate first.');
    }

    const result = await this.makeDatasetCallKw('res.users', 'write', [[userId], data]);

    return result === true;
  }

  async searchUsers(database: string, domain: any[] = []): Promise<number[]> {
    if (!database || typeof database !== 'string' || database.trim() === '') {
      throw new Error('Database is required');
    }

    if (!Array.isArray(domain)) {
      throw new Error('Domain must be an array');
    }

    if (!this.sessionId) {
      throw new Error('No active session. Please authenticate first.');
    }

    const result = await this.makeDatasetCallKw('res.users', 'search', [domain]);

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

  async changePassword(database: string, uid: number, new_password: string): Promise<any> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !uid || typeof uid !== 'number' || uid <= 0 || !Number.isInteger(uid) ||
        !new_password || typeof new_password !== 'string' || new_password.trim() === '') {
      throw new Error('Database, uid and new_password are required');
    }

    if (!this.sessionId) {
      throw new Error('No active session. Please authenticate first.');
    }

    const result = await this.makeDatasetCallKw('my.app.api', 'change_password', [uid, new_password]);

    return result;
  }
}

export const apiService = new ApiService(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8069'
);

export type { OdooAuthResult, OdooSessionResult, OdooJsonRegisterRpcRequest, OdooJsonRpcResponse, OdooUserData };

