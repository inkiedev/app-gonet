import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';

import Soporte from '../../../../app/(tabs)/home/soporte';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/support', () => ({
  supportService: {
    sendMessage: jest.fn(),
  }
}));

jest.mock('@/components/layout/header', () => ({
  Header: ({ title, leftAction }: { title: string; leftAction: any }) => {
    const MockView = require('react-native').View;
    const MockText = require('react-native').Text;
    const MockTouchableOpacity = require('react-native').TouchableOpacity;
    
    return (
      <MockView testID="header">
        <MockText>{title}</MockText>
        <MockTouchableOpacity onPress={leftAction.onPress} testID="back-button">
          <MockText>{leftAction.icon}</MockText>
        </MockTouchableOpacity>
      </MockView>
    );
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, testID }: { name: string; testID?: string }) => {
    const MockText = require('react-native').Text;
    return <MockText testID={testID || `icon-${name}`}>{name}</MockText>;
  },
}));

import { supportService } from '@/services/support';

describe('Soporte Component', () => {
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  };
  const mockSupportService = supportService as jest.Mocked<typeof supportService>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders correctly with header and input', () => {
    const { getByText, getByTestId } = render(<Soporte />);
    
    expect(getByText('Soporte')).toBeTruthy();
    expect(getByTestId('support-message-input')).toBeTruthy();
    expect(getByTestId('support-send-button')).toBeTruthy();
  });

  it('shows welcome message on mount', async () => {
    const { getByText } = render(<Soporte />);
    
    await waitFor(() => {
      expect(getByText(/¡Hola! Bienvenido al soporte de GoNet/)).toBeTruthy();
    });
  });

  it('calls router.back when back button is pressed', () => {
    const { getByTestId } = render(<Soporte />);
    
    fireEvent.press(getByTestId('back-button'));
    
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('sends message when send button is pressed', async () => {
    mockSupportService.sendMessage.mockResolvedValue('Gracias por tu mensaje');
    
    const { getByTestId, getByText } = render(<Soporte />);
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    // Type a message
    await act(async () => {
      fireEvent.changeText(messageInput, 'Hola, necesito ayuda');
    });
    
    // Send the message
    await act(async () => {
      fireEvent.press(sendButton);
    });
    
    // Check that the service was called
    await waitFor(() => {
      expect(mockSupportService.sendMessage).toHaveBeenCalledWith('Hola, necesito ayuda', undefined);
    });
    
    // Check that both user and bot messages appear
    await waitFor(() => {
      expect(getByText('Hola, necesito ayuda')).toBeTruthy();
      expect(getByText('Gracias por tu mensaje')).toBeTruthy();
    });
  });

  it('clears input after sending message', async () => {
    mockSupportService.sendMessage.mockResolvedValue('Respuesta del bot');
    
    const { getByTestId } = render(<Soporte />);
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    // Type a message
    await act(async () => {
      fireEvent.changeText(messageInput, 'Test message');
    });
    
    // Send the message
    await act(async () => {
      fireEvent.press(sendButton);
    });
    
    // Input should be cleared
    await waitFor(() => {
      expect(messageInput.props.value).toBe('');
    });
  });

  it('shows loading state while sending message', async () => {
    let resolveMessage: (value: string) => void;
    const messagePromise = new Promise<string>(resolve => {
      resolveMessage = resolve;
    });
    
    mockSupportService.sendMessage.mockReturnValue(messagePromise);
    
    const { getByTestId, getByText } = render(<Soporte />);
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    // Type and send message
    await act(async () => {
      fireEvent.changeText(messageInput, 'Test message');
    });
    
    await act(async () => {
      fireEvent.press(sendButton);
    });
    
    // Should show loading state
    expect(getByText('Escribiendo...')).toBeTruthy();
    expect(sendButton.props.disabled).toBe(true);
    
    // Resolve the promise
    await act(async () => {
      resolveMessage!('Bot response');
    });
    
    // Loading should be gone
    await waitFor(() => {
      expect(() => getByText('Escribiendo...')).toThrow();
    });
  });

  it('handles message sending errors gracefully', async () => {
    mockSupportService.sendMessage.mockRejectedValue(new Error('Network error'));
    
    const { getByTestId, getByText } = render(<Soporte />);
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    // Type and send message
    await act(async () => {
      fireEvent.changeText(messageInput, 'Test message');
    });
    
    await act(async () => {
      fireEvent.press(sendButton);
    });
    
    // Should show error message
    await waitFor(() => {
      expect(getByText('Lo siento, ocurrió un error. Por favor intenta nuevamente.')).toBeTruthy();
    });
  });

  it('disables send button when input is empty', () => {
    const { getByTestId } = render(<Soporte />);
    
    const sendButton = getByTestId('support-send-button');
    
    expect(sendButton.props.disabled).toBe(true);
  });

  it('enables send button when input has text', async () => {
    const { getByTestId } = render(<Soporte />);
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    await act(async () => {
      fireEvent.changeText(messageInput, 'Some text');
    });
    
    expect(sendButton.props.disabled).toBe(false);
  });

  it('uses custom onSendMessage when provided', async () => {
    const customHandler = jest.fn().mockResolvedValue('Custom response');
    
    const { getByTestId, getByText } = render(
      <Soporte onSendMessage={customHandler} />
    );
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    await act(async () => {
      fireEvent.changeText(messageInput, 'Custom message');
    });
    
    await act(async () => {
      fireEvent.press(sendButton);
    });
    
    expect(customHandler).toHaveBeenCalledWith('Custom message');
    expect(mockSupportService.sendMessage).not.toHaveBeenCalled();
    
    await waitFor(() => {
      expect(getByText('Custom response')).toBeTruthy();
    });
  });

  it('passes user context to support service', async () => {
    mockSupportService.sendMessage.mockResolvedValue('Response');
    
    const userContext = {
      phone: '123456789',
      cedula: '1234567890',
      sessionId: 'session123',
      userId: 'user456'
    };
    
    const { getByTestId } = render(
      <Soporte userContext={userContext} />
    );
    
    const messageInput = getByTestId('support-message-input');
    const sendButton = getByTestId('support-send-button');
    
    await act(async () => {
      fireEvent.changeText(messageInput, 'Test message');
    });
    
    await act(async () => {
      fireEvent.press(sendButton);
    });
    
    await waitFor(() => {
      expect(mockSupportService.sendMessage).toHaveBeenCalledWith('Test message', userContext);
    });
  });
});