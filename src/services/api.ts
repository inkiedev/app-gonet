import { Subscription } from '../types/subscription';

interface OdooAuthResult {
  uid: number;
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

interface Payment {
  payment_id: number;
  payment_date: string;
  amount: number;
  currency: string;
  payment_method: string;
  state: string;
  reference?: string;
  invoice_id: number;
  invoice_number: string;
  invoice_date: string;
  invoice_amount: number;
}

interface Invoice {
  invoice_id: number;
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  amount_residual: number;
  currency: string;
  state: string;
  payment_state: string;
  move_type: string;
  reference?: string;
  pdf_data?: string;
  pdf_filename?: string;
}

interface PaymentsResponse {
  success: boolean;
  payments: Payment[];
  total_payments: number;
}

interface InvoicesResponse {
  success: boolean;
  invoices: Invoice[];
  total_invoices: number;
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
      throw new Error('Las credenciales no son correctas');
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

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Invalid user data response');
    }

    return result[0];
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
      args: [database, uid, password, 'res.partner', 'write', [userId, data]]
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

  async changePassword(database: string, uid: number, password: string, new_password: string): Promise<any> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !uid || typeof uid !== 'number' || uid <= 0 || !Number.isInteger(uid) ||
        !password || typeof password !== 'string' || password.trim() === '' ||
        !new_password || typeof new_password !== 'string' || new_password.trim() === '') {
      throw new Error('Database, uid, password and new_password are required');
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute',
      args: [database, uid, password, 'my.app.api', 'change_password', uid, password,new_password]
    });

    return result;
  }

  async getSuscription(database: string, dni: string): Promise<Subscription[]> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !dni || typeof dni !== 'string' || dni.trim() === '') {
      throw new Error('Database and dni are required');
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute',
      args: [database, 2, 'admin', 'my.app.api', 'get_suscription', dni]
    });

    if (!result || !Array.isArray(result)) {
      return [];
    }

    return result;
  }

  async getPaymentsByInvoicePartner(database: string, partnerInvoiceId: number, limit?: number): Promise<PaymentsResponse> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !partnerInvoiceId || typeof partnerInvoiceId !== 'number') {
      throw new Error('Database and partnerInvoiceId are required');
    }

    const args = [database, 2, 'admin', 'my.app.api', 'get_payments_by_invoice_partner', partnerInvoiceId];
    if (limit) {
      args.push(limit);
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute',
      args: args
    });

    if (!result || typeof result !== 'object') {
      return {
        success: false,
        payments: [],
        total_payments: 0
      };
    }

    return result;
  }

  async getInvoicesByPartner(database: string, partnerInvoiceId: number, limit?: number): Promise<InvoicesResponse> {
    if (!database || typeof database !== 'string' || database.trim() === '' ||
        !partnerInvoiceId || typeof partnerInvoiceId !== 'number') {
      throw new Error('Database and partnerInvoiceId are required');
    }

    const args = [database, 2, 'admin', 'my.app.api', 'get_invoices_by_partner', partnerInvoiceId];
    if (limit) {
      args.push(limit);
    }

    const result = await this.makeJsonRpcRequest('call', {
      service: 'object',
      method: 'execute',
      args: args
    });

    if (!result || typeof result !== 'object') {
      return {
        success: false,
        invoices: [],
        total_invoices: 0
      };
    }

    return result;
  }
}

export const apiService = new ApiService(
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.70.123:8069'
);

export type { 
  OdooAuthResult, 
  OdooJsonRegisterRpcRequest, 
  OdooJsonRpcResponse, 
  OdooUserData, 
  Subscription,
  Payment,
  Invoice,
  PaymentsResponse,
  InvoicesResponse
};

