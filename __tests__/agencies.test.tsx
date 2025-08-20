import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import AgenciesScreen from '@/app/(tabs)/agencies';

// Mock dependencies
jest.mock('expo-router');

// Mock agencies data
const mockAgenciesData = {
  coverage: {
    provinces: [
      {
        id: 1,
        name: 'Pichincha',
        cities: [
          {
            id: 1,
            name: 'Quito',
            coverage: true,
            zones: ['Norte', 'Centro', 'Sur']
          },
          {
            id: 2,
            name: 'Cayambe',
            coverage: false,
            zones: []
          }
        ]
      },
      {
        id: 2,
        name: 'Guayas',
        cities: [
          {
            id: 3,
            name: 'Guayaquil',
            coverage: true,
            zones: ['Norte', 'Centro', 'Sur', 'Este', 'Oeste']
          },
          {
            id: 4,
            name: 'Samborondón',
            coverage: true,
            zones: ['Centro']
          }
        ]
      }
    ]
  },
  franchises: [
    {
      id: 1,
      name: 'GoNet Quito Centro',
      address: 'Av. Amazonas N24-03 y Colón',
      phone: '+593-2-2234567',
      email: 'quito.centro@gonet.com',
      city: 'Quito',
      province: 'Pichincha',
      workingHours: 'Lunes a Viernes 8:00 - 17:00'
    },
    {
      id: 2,
      name: 'GoNet Guayaquil Norte',
      address: 'Av. Francisco de Orellana, Edificio World Trade Center',
      phone: '+593-4-2123456',
      email: 'guayaquil.norte@gonet.com',
      city: 'Guayaquil',
      province: 'Guayas',
      workingHours: 'Lunes a Viernes 8:00 - 18:00'
    }
  ]
};

// Mock the agencies service
const mockAgenciesService = {
  getCoverage: jest.fn(),
  getFranchises: jest.fn()
};

jest.mock('@/services/agencies', () => ({
  agenciesService: mockAgenciesService
}));

describe('Agencies Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAgenciesService.getCoverage.mockResolvedValue({
      success: true,
      data: mockAgenciesData.coverage
    });
    mockAgenciesService.getFranchises.mockResolvedValue({
      success: true,
      data: mockAgenciesData.franchises
    });
  });

  // A-01: Consultar cobertura por ciudad/provincia
  test('A-01: Should display coverage list by city/province with available zones', async () => {
    const { getByTestId, findByText, findAllByText } = render(<AgenciesScreen />);
    
    // Switch to coverage tab
    const coverageTab = getByTestId('coverage-tab');
    fireEvent.press(coverageTab);
    
    // Verify provinces are displayed
    expect(await findByText('Pichincha')).toBeTruthy();
    expect(await findByText('Guayas')).toBeTruthy();
    
    // Verify cities with coverage are displayed
    expect(await findByText('Quito')).toBeTruthy();
    expect(await findByText('Guayaquil')).toBeTruthy();
    expect(await findByText('Samborondón')).toBeTruthy();
    
    // Verify coverage zones are shown
    const zonesNorte = await findAllByText('Norte');
    expect(zonesNorte.length).toBeGreaterThan(0);
    expect(await findByText('Centro')).toBeTruthy();
    expect(await findByText('Sur')).toBeTruthy();
    
    // Verify cities without coverage are handled
    expect(await findByText('Cayambe')).toBeTruthy();
    expect(await findByText(/Sin cobertura|No disponible/i)).toBeTruthy();
  });

  // A-02: Mostrar agencias franquiciadas
  test('A-02: Should display franchise agencies with address and contact information', async () => {
    const { getByTestId, findByText } = render(<AgenciesScreen />);
    
    // Switch to franchises tab
    const franchisesTab = getByTestId('franchises-tab');
    fireEvent.press(franchisesTab);
    
    // Verify franchise names are displayed
    expect(await findByText('GoNet Quito Centro')).toBeTruthy();
    expect(await findByText('GoNet Guayaquil Norte')).toBeTruthy();
    
    // Verify addresses are shown
    expect(await findByText('Av. Amazonas N24-03 y Colón')).toBeTruthy();
    expect(await findByText('Av. Francisco de Orellana, Edificio World Trade Center')).toBeTruthy();
    
    // Verify contact information is displayed
    expect(await findByText('+593-2-2234567')).toBeTruthy();
    expect(await findByText('+593-4-2123456')).toBeTruthy();
    expect(await findByText('quito.centro@gonet.com')).toBeTruthy();
    expect(await findByText('guayaquil.norte@gonet.com')).toBeTruthy();
    
    // Verify working hours are shown
    expect(await findByText('Lunes a Viernes 8:00 - 17:00')).toBeTruthy();
    expect(await findByText('Lunes a Viernes 8:00 - 18:00')).toBeTruthy();
  });

});