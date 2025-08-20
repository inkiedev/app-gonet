import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

// Mock dependencies
jest.mock('expo-router');
jest.mock('@/services/auth');

// Mock user data
const mockUserData = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  cedula: '0987654321',
  phone: '+593987654321'
};

const mockPlansData = {
  active: [
    {
      id: 1,
      name: 'GoPlus',
      speed: 750,
      price: 25.99,
      status: 'active',
      features: ['Wifi Total', 'Streaming', 'Soporte 24/7']
    }
  ],
  available: [
    {
      id: 2,
      name: 'GoMax',
      speed: 1000,
      price: 35.99,
      status: 'available',
      features: ['Wifi Total', 'Streaming Premium', 'Soporte Prioritario']
    },
    {
      id: 3,
      name: 'GoBasic',
      speed: 300,
      price: 15.99,
      status: 'available',
      features: ['Internet Básico', 'Soporte Normal']
    }
  ]
};

// Mock the profile service
jest.mock('@/services/profile', () => ({
  profileService: {
    getUserData: jest.fn().mockResolvedValue({
      success: true,
      data: mockUserData
    }),
    getPlans: jest.fn().mockResolvedValue({
      success: true,
      data: mockPlansData
    })
  }
}));

describe('Profile Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // P-01: Visualizar datos personales (nombre, correo, cédula)
  test('P-01: Should display personal data correctly (name, email, cedula)', async () => {
    const { findByText } = render(<ProfileScreen />);
    
    // Wait for data to load and verify personal information is displayed
    expect(await findByText('Juan')).toBeTruthy();
    expect(await findByText('Pérez')).toBeTruthy();
    expect(await findByText('juan.perez@example.com')).toBeTruthy();
    expect(await findByText('0987654321')).toBeTruthy();
  });

  // P-02: Visualizar planes activos
  test('P-02: Should display active plans with details (speed, price)', async () => {
    const { findByText } = render(<ProfileScreen />);
    
    // Verify active plan information is displayed
    expect(await findByText('GoPlus')).toBeTruthy();
    expect(await findByText('750')).toBeTruthy(); // Speed
    expect(await findByText('25.99')).toBeTruthy(); // Price
    expect(await findByText('active')).toBeTruthy(); // Status
    
    // Verify plan features are shown
    expect(await findByText('Wifi Total')).toBeTruthy();
    expect(await findByText('Streaming')).toBeTruthy();
    expect(await findByText('Soporte 24/7')).toBeTruthy();
  });

  // P-03: Visualizar planes adicionales
  test('P-03: Should display additional available plans with contract option', async () => {
    const { findByText, findAllByText } = render(<ProfileScreen />);
    
    // Verify available plans are displayed
    expect(await findByText('GoMax')).toBeTruthy();
    expect(await findByText('GoBasic')).toBeTruthy();
    
    // Verify plan details
    expect(await findByText('1000')).toBeTruthy(); // GoMax speed
    expect(await findByText('35.99')).toBeTruthy(); // GoMax price
    expect(await findByText('300')).toBeTruthy(); // GoBasic speed
    expect(await findByText('15.99')).toBeTruthy(); // GoBasic price
    
    // Verify contract options are available
    const contractButtons = await findAllByText(/Contratar|Seleccionar/i);
    expect(contractButtons.length).toBeGreaterThan(0);
  });
});