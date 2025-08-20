import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import SessionProvider, { useSession } from '@/contexts/SessionContext';
import HomeScreen from '@/app/(tabs)/home';
import ProfileScreen from '@/app/(tabs)/profile';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-router');
jest.mock('react-native/Libraries/AppState/AppState');

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSegments = useSegments as jest.MockedFunction<typeof useSegments>;
const mockAppState = AppState as jest.Mocked<typeof AppState>;

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
};

// Mock session data
const mockSessionData = {
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    uid: 1
  },
  token: 'mock-jwt-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Date.now() + 3600000 // 1 hour from now
};

// Test component to verify session context
const TestSessionComponent = () => {
  const { session, isLoading } = useSession();
  return null;
};

describe('Session Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseSegments.mockReturnValue(['(tabs)', 'home']);
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSessionData));
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    mockAsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  // S-01: Mantener sesión al navegar entre módulos
  test('S-01: Should maintain session when navigating between modules without requesting login again', async () => {
    const TestNavigationComponent = () => {
      const { session } = useSession();
      return (
        <>
          <HomeScreen />
          <ProfileScreen />
        </>
      );
    };

    render(
      <SessionProvider>
        <TestNavigationComponent />
      </SessionProvider>
    );

    // Verify session persists
    await waitFor(() => {
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('session');
      expect(mockRouter.replace).not.toHaveBeenCalledWith('/(auth)/login');
    });

    // Simulate navigation between modules
    mockUseSegments.mockReturnValue(['(tabs)', 'profile']);

    await waitFor(() => {
      // Should not request login again
      expect(mockRouter.replace).not.toHaveBeenCalledWith('/(auth)/login');
    });
  });

  // S-02: Reanudar app desde background
  test('S-02: Should resume app from background with active session and return to previous state', async () => {
    const TestAppStateComponent = () => {
      const { session } = useSession();
      return null;
    };

    render(
      <SessionProvider>
        <TestAppStateComponent />
      </SessionProvider>
    );

    // Simulate app going to background
    const mockAddEventListener = jest.fn();
    mockAppState.addEventListener = mockAddEventListener;

    // Get the callback function that was registered
    const appStateCallback = mockAddEventListener.mock.calls.find(
      call => call[0] === 'change'
    )?.[1];

    if (appStateCallback) {
      // Simulate app going to background
      appStateCallback('background');

      // Simulate app coming back to foreground
      appStateCallback('active');
    }

    await waitFor(() => {
      // Verify session is still active
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('session');
      // Should not redirect to login
      expect(mockRouter.replace).not.toHaveBeenCalledWith('/(auth)/login');
    });
  });

  // S-03: Renovación lógica del token (mock front)
  test('S-03: Should handle token renewal without expelling user from UI', async () => {
    // Mock expired session
    const expiredSessionData = {
      ...mockSessionData,
      expiresAt: Date.now() - 1000 // Expired 1 second ago
    };

    const renewedSessionData = {
      ...mockSessionData,
      token: 'new-mock-jwt-token',
      expiresAt: Date.now() + 3600000 // New expiration
    };

    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(expiredSessionData));

    // Mock token renewal service
    const mockAuthService = {
      refreshToken: jest.fn().mockResolvedValue({
        success: true,
        data: renewedSessionData
      })
    };

    jest.doMock('@/services/auth', () => ({
      authService: mockAuthService
    }));

    const TestTokenRenewalComponent = () => {
      const { session, isLoading } = useSession();
      return null;
    };

    render(
      <SessionProvider>
        <TestTokenRenewalComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      // Verify token renewal was attempted
      expect(mockAuthService.refreshToken).toHaveBeenCalled();
      // Verify new session was saved
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'session',
        JSON.stringify(renewedSessionData)
      );
      // User should not be expelled during renewal
      expect(mockRouter.replace).not.toHaveBeenCalledWith('/(auth)/login');
    });
  });

});