import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import LoginScreen from '../../../app/(auth)/login';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.Alert.alert = jest.fn();
  
  // Mock animated components
  RN.Animated.timing = () => ({
    start: (callback?: () => void) => callback && callback(),
  });
  
  return RN;
});

// Mock image require
jest.mock('@/assets/images/fondo_login.jpg', () => 'fondo_login.jpg');

// Mock components that might cause issues
jest.mock('@/components/app/app-logo', () => ({
  AppLogo: ({ variant }: { variant: string }) => {
    const MockText = require('react-native').Text;
    return <MockText testID="app-logo">{variant} Logo</MockText>;
  },
}));

jest.mock('@expo/vector-icons', () => ({
  FontAwesome: ({ name, style }: { name: string; style: any }) => {
    const MockText = require('react-native').Text;
    return <MockText testID={`icon-${name}`} style={style}>{name}</MockText>;
  },
}));

// Don't mock the auth service - we want to test the mock implementation
jest.mock('@/services/auth', () => ({
  authService: {
    login: jest.fn().mockRejectedValue(new Error('Should not be called in mock mode')),
  }
}));

describe('LoginScreen - Mock Mode', () => {
  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (Alert.alert as jest.Mock).mockClear();
  });

  it('shows mock development info when in dev mode', () => {
    const { getByText } = render(<LoginScreen />);
    
    expect(getByText('MODO DESARROLLO')).toBeTruthy();
    expect(getByText('Usuarios de prueba:')).toBeTruthy();
    expect(getByText('admin/admin123')).toBeTruthy();
    expect(getByText('testuser/test123')).toBeTruthy();
    expect(getByText('demo/demo123')).toBeTruthy();
  });

  it('successfully logs in with mock admin credentials', async () => {
    const { getByTestId } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'admin');
      fireEvent.changeText(passwordInput, 'admin123');
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login exitoso', 'Bienvenido Administrator (MOCK)');
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('successfully logs in with mock testuser credentials', async () => {
    const { getByTestId } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(passwordInput, 'test123');
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login exitoso', 'Bienvenido Test User (MOCK)');
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('successfully logs in with mock demo credentials', async () => {
    const { getByTestId } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'demo');
      fireEvent.changeText(passwordInput, 'demo123');
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login exitoso', 'Bienvenido Demo User (MOCK)');
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error for invalid mock credentials', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'wronguser');
      fireEvent.changeText(passwordInput, 'wrongpass');
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Credenciales incorrectas');
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(getByText('Credenciales incorrectas')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows loading state during mock authentication', async () => {
    const { getByTestId } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'admin');
      fireEvent.changeText(passwordInput, 'admin123');
    });
    
    // Start login process
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    // Should show loading state immediately
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
    
    // Wait for completion
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});