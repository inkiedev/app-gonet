import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import { authService } from '@/services/auth';
import LoginScreen from '../../../app/(auth)/login';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/services/auth', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
  }
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

describe('LoginScreen', () => {
  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  };
  const mockAuthService = authService as jest.Mocked<typeof authService>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (Alert.alert as jest.Mock).mockClear();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<LoginScreen />);
    
    expect(getByText('BIENVENIDO')).toBeTruthy();
    expect(getByTestId('app-logo')).toBeTruthy();
    expect(getByTestId('icon-user')).toBeTruthy();
    expect(getByPlaceholderText('Nombre de Usuario')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
    expect(getByText('¿Nuevo Usuario?')).toBeTruthy();
    expect(getByText('Regístrate aquí')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(getByText('Mínimo 3 caracteres')).toBeTruthy();
    });
    
    await waitFor(() => {
      expect(getByText('Mínimo 6 caracteres')).toBeTruthy();
    });
  });

  it('shows validation error for short username', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'ab'); // Less than 3 characters
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(getByText('Mínimo 3 caracteres')).toBeTruthy();
    });
  });

  it('shows validation error for short password', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    await act(async () => {
      fireEvent.changeText(usernameInput, 'admin');
      fireEvent.changeText(passwordInput, '12345'); // Less than 6 characters
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(getByText('Mínimo 6 caracteres')).toBeTruthy();
    });
  });

  it('authenticates with correct credentials on successful submission', async () => {
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

  it('shows mock development info in dev mode', () => {
    const { getByText } = render(<LoginScreen />);
    
    // Should show mock mode indicators
    expect(getByText('MODO DESARROLLO')).toBeTruthy();
    expect(getByText('Usuarios de prueba:')).toBeTruthy();
    expect(getByText('admin/admin123')).toBeTruthy();
    expect(getByText('testuser/test123')).toBeTruthy();
    expect(getByText('demo/demo123')).toBeTruthy();
  });

  it('shows error message and alert on failed login', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    // Use invalid credentials that won't match mock users
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

  it('works with admin credentials', async () => {
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

  it('clears error message when trying to login again', async () => {
    const { getByTestId, getByText, queryByText } = render(<LoginScreen />);
    
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');
    
    // First attempt with invalid credentials
    await act(async () => {
      fireEvent.changeText(usernameInput, 'wronguser');
      fireEvent.changeText(passwordInput, 'wrongpass');
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(getByText('Credenciales incorrectas')).toBeTruthy();
    }, { timeout: 3000 });
    
    // Second attempt with valid credentials
    await act(async () => {
      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(passwordInput, 'test123');
    });
    
    await act(async () => {
      fireEvent.press(loginButton);
    });
    
    // Error should be cleared
    await waitFor(() => {
      expect(queryByText('Credenciales incorrectas')).toBeFalsy();
    }, { timeout: 3000 });
  });

  it('shows loading state while submitting', async () => {
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
    
    // Should show loading state immediately after press
    // The button should be disabled during loading
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
    
    // Wait for completion
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('works with demo credentials', async () => {
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
});