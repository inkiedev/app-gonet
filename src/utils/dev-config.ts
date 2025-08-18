/**
 * Development Configuration
 * 
 * This file contains development-only configuration flags.
 * These settings only apply when __DEV__ is true.
 */

export const DEV_CONFIG = {
  // Authentication settings
  USE_MOCK_AUTH: __DEV__ && true,
  
  // Mock user credentials for development
  MOCK_USERS: [
    { username: 'admin', password: 'admin123', name: 'Administrator', email: 'admin@gonet.com' },
    { username: 'testuser', password: 'test123', name: 'Test User', email: 'test@gonet.com' },
    { username: 'demo', password: 'demo123', name: 'Demo User', email: 'demo@gonet.com' },
  ] as const,
  
  // API settings
  MOCK_API_DELAY: 1000, // milliseconds
  
  // UI settings
  SHOW_DEV_INFO: __DEV__ && true,
} as const;

export type MockUser = typeof DEV_CONFIG.MOCK_USERS[number];