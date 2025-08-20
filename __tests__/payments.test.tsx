import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PaymentsScreen from '@/app/(tabs)/payments';

// Mock dependencies
jest.mock('expo-router');

// Mock invoice data
const mockInvoicesData = {
  paid: [
    {
      id: 1,
      amount: 25.99,
      dueDate: '2024-07-15',
      paymentDate: '2024-07-10',
      status: 'paid',
      invoiceNumber: 'INV-2024-001',
      period: 'Julio 2024'
    },
    {
      id: 2,
      amount: 25.99,
      dueDate: '2024-06-15',
      paymentDate: '2024-06-12',
      status: 'paid',
      invoiceNumber: 'INV-2024-002',
      period: 'Junio 2024'
    }
  ],
  pending: [
    {
      id: 3,
      amount: 25.99,
      dueDate: '2024-08-15',
      status: 'pending',
      invoiceNumber: 'INV-2024-003',
      period: 'Agosto 2024',
      paymentDate: null
    }
  ]
};

// Mock the payments service
jest.mock('@/services/payments', () => ({
  paymentsService: {
    getInvoices: jest.fn().mockResolvedValue({
      success: true,
      data: mockInvoicesData
    })
  }
}));

describe('Payments Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // PG-01: Mostrar facturas ya pagadas
  test('PG-01: Should display paid invoices in "Pagadas" section', async () => {
    const { findByText, findAllByText } = render(<PaymentsScreen />);
    
    // Verify "Pagadas" section exists
    expect(await findByText('Pagadas')).toBeTruthy();
    
    // Verify paid invoices are displayed
    expect(await findByText('INV-2024-001')).toBeTruthy();
    expect(await findByText('INV-2024-002')).toBeTruthy();
    expect(await findByText('Julio 2024')).toBeTruthy();
    expect(await findByText('Junio 2024')).toBeTruthy();
    
    // Verify payment dates are shown
    expect(await findByText('2024-07-10')).toBeTruthy();
    expect(await findByText('2024-06-12')).toBeTruthy();
    
    // Verify amounts are displayed
    const amounts = await findAllByText('25.99');
    expect(amounts.length).toBeGreaterThanOrEqual(2);
    
    // Verify status is "paid"
    const paidStatuses = await findAllByText(/pagad[oa]/i);
    expect(paidStatuses.length).toBeGreaterThanOrEqual(2);
  });

  // PG-02: Mostrar factura del mes pendiente
  test('PG-02: Should display pending monthly invoice with amount, due date and "Pendiente" status', async () => {
    const { findByText } = render(<PaymentsScreen />);
    
    // Verify pending invoice is displayed
    expect(await findByText('INV-2024-003')).toBeTruthy();
    expect(await findByText('Agosto 2024')).toBeTruthy();
    
    // Verify amount is shown
    expect(await findByText('25.99')).toBeTruthy();
    
    // Verify due date is displayed
    expect(await findByText('2024-08-15')).toBeTruthy();
    
    // Verify status is "Pendiente"
    expect(await findByText(/pendiente/i)).toBeTruthy();
    
    // Verify no payment date is shown for pending invoice
    expect(screen.queryByText('Fecha de pago')).toBeNull();
  });

});