import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import BotScreen from '@/app/(tabs)/bot';

// Mock dependencies
jest.mock('expo-router');

// Mock chat data
const mockChatData = {
  messages: [
    {
      id: 1,
      text: 'Hola, ¿en qué puedo ayudarte?',
      sender: 'bot',
      timestamp: '2024-08-19T10:00:00Z'
    }
  ]
};

const mockWebhookResponse = {
  success: true,
  data: {
    message: 'Gracias por contactarnos. ¿Cuál es tu consulta?',
    timestamp: '2024-08-19T10:01:00Z'
  }
};

// Mock the bot service
const mockBotService = {
  sendMessage: jest.fn(),
  getMessages: jest.fn(),
  connectWebhook: jest.fn()
};

jest.mock('@/services/bot', () => ({
  botService: mockBotService
}));

// Mock fetch for webhook calls
global.fetch = jest.fn();

describe('Bot Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBotService.getMessages.mockResolvedValue({
      success: true,
      data: mockChatData.messages
    });
    mockBotService.sendMessage.mockResolvedValue(mockWebhookResponse);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockWebhookResponse
    });
  });

  // B-01: Iniciar conversación con el chatbot
  test('B-01: Should start conversation with chatbot and send/receive messages correctly', async () => {
    const { getByTestId, findByText } = render(<BotScreen />);
    
    // Verify initial bot message is displayed
    expect(await findByText('Hola, ¿en qué puedo ayudarte?')).toBeTruthy();
    
    // Find input and send button
    const messageInput = getByTestId('chat-input');
    const sendButton = getByTestId('send-button');
    
    // Type a message
    fireEvent.changeText(messageInput, 'Necesito ayuda con mi plan');
    fireEvent.press(sendButton);
    
    // Verify message was sent
    await waitFor(() => {
      expect(mockBotService.sendMessage).toHaveBeenCalledWith('Necesito ayuda con mi plan');
    });
    
    // Verify user message appears in chat
    expect(await findByText('Necesito ayuda con mi plan')).toBeTruthy();
    
    // Verify bot response appears
    expect(await findByText('Gracias por contactarnos. ¿Cuál es tu consulta?')).toBeTruthy();
    
    // Verify input is cleared after sending
    expect(messageInput.props.value).toBe('');
  });

  // B-02: Manejo de error en conexión al webhook
  test('B-02: Should handle webhook connection error and show retry option', async () => {
    // Mock webhook error
    mockBotService.sendMessage.mockRejectedValue(new Error('Webhook connection failed'));
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const { getByTestId, findByText } = render(<BotScreen />);
    
    const messageInput = getByTestId('chat-input');
    const sendButton = getByTestId('send-button');
    
    // Try to send a message
    fireEvent.changeText(messageInput, 'Test message');
    fireEvent.press(sendButton);
    
    // Verify error message is displayed
    expect(await findByText(/Error.*conexión|No se pudo enviar/i)).toBeTruthy();
    
    // Verify retry option is available
    const retryButton = await findByText(/Reintentar|Intentar de nuevo/i);
    expect(retryButton).toBeTruthy();
    
    // Test retry functionality
    mockBotService.sendMessage.mockResolvedValueOnce(mockWebhookResponse);
    fireEvent.press(retryButton);
    
    await waitFor(() => {
      expect(mockBotService.sendMessage).toHaveBeenCalledTimes(2);
    });
  });

});