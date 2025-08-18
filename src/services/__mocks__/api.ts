import { OdooAuthResult, OdooUserData } from '../api';

// Mock user data
const mockUsers = [
  {
    username: 'admin',
    password: 'admin123',
    userData: {
      id: 1,
      name: 'Administrator',
      email: 'admin@gonet.com',
      uid: 1,
      session_id: 'mock-session-admin-123'
    }
  },
  {
    username: 'testuser',
    password: 'test123',
    userData: {
      id: 2,
      name: 'Test User',
      email: 'test@gonet.com',
      uid: 2,
      session_id: 'mock-session-test-456'
    }
  },
  {
    username: 'demo',
    password: 'demo123',
    userData: {
      id: 3,
      name: 'Demo User',
      email: 'demo@gonet.com',
      uid: 3,
      session_id: 'mock-session-demo-789'
    }
  }
];

class MockApiService {
  private baseUrl: string;
  private requestId: number = 1;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(database: string, username: string, password: string): Promise<OdooAuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Input validation
    if (!database || !username || !password) {
      throw new Error('Database, username and password are required');
    }

    if (username.trim() === '' || password.trim() === '') {
      throw new Error('Username and password cannot be empty');
    }

    // Find matching user
    const user = mockUsers.find(u => 
      u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      uid: user.userData.uid,
      session_id: user.userData.session_id
    };
  }

  async getUserData(database: string, uid: number, password: string, userId: number): Promise<OdooUserData[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Input validation
    if (!database || !uid || !password || !userId) {
      throw new Error('All parameters are required');
    }

    // Find user by uid
    const user = mockUsers.find(u => u.userData.uid === uid);

    if (!user) {
      throw new Error('User not found');
    }

    return [user.userData];
  }

  async updateUserProfile(database: string, uid: number, password: string, userId: number, data: any): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Input validation
    if (!database || !uid || !password || !userId || !data) {
      throw new Error('All parameters are required');
    }

    // Find user
    const userIndex = mockUsers.findIndex(u => u.userData.uid === uid);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data (simulate)
    mockUsers[userIndex].userData = { ...mockUsers[userIndex].userData, ...data };
    
    return true;
  }

  async searchUsers(database: string, uid: number, password: string, domain: any[] = []): Promise<number[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Input validation
    if (!database || !uid || !password) {
      throw new Error('Database, uid and password are required');
    }

    // Return mock user IDs
    return mockUsers.map(u => u.userData.id);
  }

  async createUser(database: string, uid: number, password: string, userData: any): Promise<number> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Input validation
    if (!database || !uid || !password || !userData) {
      throw new Error('All parameters are required');
    }

    // Create new mock user
    const newId = Math.max(...mockUsers.map(u => u.userData.id)) + 1;
    const newUser = {
      username: userData.login || 'newuser',
      password: 'defaultpass',
      userData: {
        id: newId,
        name: userData.name || 'New User',
        email: userData.email || 'newuser@gonet.com',
        uid: newId,
        session_id: `mock-session-${newId}`
      }
    };

    mockUsers.push(newUser);
    return newId;
  }
}

export const apiService = new MockApiService(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8069'
);

export type { OdooAuthResult, OdooUserData };