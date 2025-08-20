import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import LoginScreen from '../app/(auth)/login';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Login Module Tests', () => {
  
  beforeEach(() => {
    mockAlert.mockClear();
  });
  
  // L-01: Acceso con correo y contraseña correctos
  test('L-01: Should login successfully with correct credentials', async () => {
    const { getByTestId } = render(<LoginScreen />);

    const emailInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    await act(async () => {
      fireEvent.changeText(emailInput, 'admin');
      fireEvent.changeText(passwordInput, 'admin123');
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Login exitoso',
        expect.stringContaining('Bienvenido Administrator')
      );
    }, { timeout: 3000 });
  });

  // L-02: Acceso con credenciales incorrectas
  test('L-02: Should show error message with invalid credentials', async () => {
    const { getByTestId } = render(<LoginScreen />);

    const emailInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    await act(async () => {
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent.changeText(passwordInput, 'invalid');
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Credenciales incorrectas');
    }, { timeout: 3000 });
  });

  // L-03: Acceso con contraseña incorrecta
  test('L-03: Should show error message with wrong password', async () => {
    const { getByTestId } = render(<LoginScreen />);

    const emailInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    await act(async () => {
      fireEvent.changeText(emailInput, 'admin');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Credenciales incorrectas');
    }, { timeout: 3000 });
  });
});