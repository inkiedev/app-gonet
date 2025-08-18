# Mock Login Implementation

This document explains how to use the mock login functionality for development and testing.

## 🚀 Quick Start

The login screen automatically uses mock authentication in development mode. Simply use any of these test credentials:

- **Admin**: `admin` / `admin123`
- **Test User**: `testuser` / `test123`  
- **Demo User**: `demo` / `demo123`

## ⚙️ Configuration

Edit `src/utils/dev-config.ts` to modify mock settings:

```typescript
export const DEV_CONFIG = {
  USE_MOCK_AUTH: __DEV__ && true,  // Enable/disable mock auth
  SHOW_DEV_INFO: __DEV__ && true,  // Show mock credentials on screen
  MOCK_API_DELAY: 1000,           // Simulated API delay in ms
  
  MOCK_USERS: [
    // Add or modify test users here
    { username: 'admin', password: 'admin123', name: 'Administrator', email: 'admin@gonet.com' },
  ],
};
```

## 🔄 Switching Between Mock and Real API

### Option 1: Dev Config File (Recommended)
```typescript
// In src/utils/dev-config.ts
USE_MOCK_AUTH: __DEV__ && false,  // Set to false for real API
```

### Option 2: Environment-based
The mock is automatically disabled in production (`__DEV__` is false).

## 📱 UI Indicators

When mock mode is active, you'll see:
- "MODO DESARROLLO" banner
- List of available test credentials
- "(MOCK)" suffix in success messages

## 🧪 Testing

### Mock Tests
```bash
npm test login-mock  # Tests the mock implementation
```

### Integration Tests  
```bash
npm test login       # Tests both mock and real auth scenarios
```

## 📁 File Structure

```
app/(auth)/login.tsx          # Main login component with mock integration
src/utils/dev-config.ts       # Centralized development configuration
src/services/auth.ts          # Real authentication service
src/services/__mocks__/api.ts # Mock API service for testing
__tests__/app/(auth)/         # Login component tests
```

## 🛠️ Development Workflow

1. **Start Development**: Mock auth is enabled by default
2. **Add New Mock User**: Edit `DEV_CONFIG.MOCK_USERS` in dev-config.ts
3. **Test Real API**: Set `USE_MOCK_AUTH: false` in dev-config.ts
4. **Run Tests**: All tests work with mock implementation
5. **Production Build**: Mock is automatically disabled

## ✨ Features

- ✅ Form validation with Zod schema
- ✅ Loading states and error handling  
- ✅ Simulated API delays for realistic testing
- ✅ Visual development indicators
- ✅ Easy toggle between mock and real API
- ✅ Comprehensive test coverage
- ✅ TypeScript support with proper types
- ✅ Centralized configuration management

## 🚫 Important Notes

- Mock authentication only works in development (`__DEV__ === true`)
- Production builds automatically use real API regardless of settings
- All form validation and error handling remains identical
- Mock users are stored in memory only (not persistent)

Happy coding! 🎉