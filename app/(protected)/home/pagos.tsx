import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/custom-button";
import { Select } from "@/components/ui/custom-select";
import Text from "@/components/ui/custom-text";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { useTheme } from "@/contexts/theme-context";
import { apiService, Invoice, InvoicesResponse, Payment, PaymentsResponse } from '@/services/api';
import { RootState } from '@/store';
import { Subscription } from '@/types/subscription';
import { AntDesign, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createSelector } from '@reduxjs/toolkit';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from 'react-redux';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const selectAuthData = createSelector(
  (state: RootState) => state.auth.subscriptions,
  (state: RootState) => state.auth.currentAccount,
  (subscriptions, currentAccount) => ({
    subscriptions,
    currentAccount,
  })
);

export default function PaymentsScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const router = useRouter();
  
  const { subscriptions, currentAccount } = useSelector(selectAuthData);

  const [selectedAccount, setSelectedAccount] = useState<Subscription | undefined>(currentAccount || undefined);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  
const handlePaymentPress = async () => {
    try {
      const supported = await Linking.canOpenURL(`https://pagos.gonet.ec/payment/${selectedAccount?.partner.dni}`);
      if (supported) {
        await Linking.openURL(`https://pagos.gonet.ec/payment/${selectedAccount?.partner.dni}`);
      } else {
        console.warn(`Cannot open URL: `);
      }
    } catch (error) {
      console.error(`Error opening ${name}:`, error);
    }
};

  useEffect(() => {
    if (selectedAccount?.partner_invoice?.id) {
      loadPayments();
    }
  }, [selectedAccount]);

  const loadPayments = async () => {
    if (!selectedAccount?.partner_invoice?.id) return;
    
    setIsLoadingPayments(true);
    try {
      const response: PaymentsResponse = await apiService.getPaymentsByInvoicePartner(
        'enterprise',
        selectedAccount.partner_invoice.id,
        5 // Limitar a 5 pagos recientes
      );
      
      if (response.success) {
        setPayments(response.payments);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const loadInvoices = async () => {
    if (!selectedAccount?.partner_invoice?.id) return;
    
    setIsLoadingInvoices(true);
    try {
      const response: InvoicesResponse = await apiService.getInvoicesByPartner(
        'enterprise',
        selectedAccount.partner_invoice.id,
        5 // Limitar a 5 facturas recientes
      );
      
      if (response.success) {
        setInvoices(response.invoices);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const handleInvoiceConsultation = () => {
    loadInvoices();
  };

  const getPaymentStatusColor = (state: string) => {
    switch (state) {
      case 'posted': return theme.colors.success || '#10B981';
      case 'draft': return theme.colors.warning || '#F59E0B';
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.text.secondary;
    }
  };

  const getPaymentStatusText = (state: string) => {
    switch (state) {
      case 'posted': return 'Confirmado';
      case 'draft': return 'Borrador';
      case 'cancelled': return 'Cancelado';
      default: return state;
    }
  };

  const getInvoiceStatusColor = (paymentState: string) => {
    switch (paymentState) {
      case 'paid': return theme.colors.success || '#10B981';
      case 'partial': return theme.colors.warning || '#F59E0B';
      case 'not_paid': return theme.colors.error;
      default: return theme.colors.text.secondary;
    }
  };

  const getInvoiceStatusText = (paymentState: string) => {
    switch (paymentState) {
      case 'paid': return 'Pagado';
      case 'partial': return 'Parcial';
      case 'not_paid': return 'Pendiente';
      default: return paymentState;
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
      <Header
        title="Pagos"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />

      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerContent}>
          <Text style={dynamicStyles.contentTitle}>Valor Pendiente</Text>
          <Text style={dynamicStyles.pendingAmount}>
            ${selectedAccount ? selectedAccount.residual : "0.00"}
          </Text>

          <Select
            options={subscriptions.map(subscription => ({ value: subscription }))}
            value={selectedAccount}
            onValueChange={(value, index) => setSelectedAccount(value)}
            renderItem={(option, index, isSelected) => {
              return (
                <View>
                  <Text style={dynamicStyles.selectText}>#{option.value.id}</Text>
                  <Text style={dynamicStyles.selectText}>{option.value.partner.name}</Text>
                  <Text style={dynamicStyles.selectText}>{option.value.partner.street}</Text>
                  
                </View>
              );
            }}
            variant="default"
            size="md"
            leftIcon={<Foundation name="info" size={24} color={theme.colors.text.primary} />}
            placeholder="Selecciona una cuenta"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        style={dynamicStyles.scrollView}
      >
        <View style={dynamicStyles.paymentsContent}>
          <ExpandableCard
            title="Métodos de Pago"
            style={dynamicStyles.expandableCard}
            icon={
              <MaterialIcons 
                name="payment" 
                size={24} 
                color={theme.colors.primary} 
              />
            }
          >
            <View style={dynamicStyles.cardActions}>
              <Button
                title="Ir al enlace de pago"
                onPress={() => handlePaymentPress()}
                size="sm"
              />
            </View>
          </ExpandableCard>

          <ExpandableCard
            title="Historial de Pagos"
            style={dynamicStyles.expandableCard}
            icon={
              <Ionicons 
                name="time-outline" 
                size={24} 
                color={theme.colors.primary} 
              />
            }
          >
            {isLoadingPayments ? (
              <View style={dynamicStyles.loadingContainer}>
                <Text style={dynamicStyles.loadingText}>Cargando pagos...</Text>
              </View>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <View key={payment.payment_id} style={dynamicStyles.historyItem}>
                  <View style={dynamicStyles.historyInfo}>
                    <Text style={dynamicStyles.historyDate}>{payment.payment_date}</Text>
                    <Text style={dynamicStyles.historyMethod}>{payment.payment_method}</Text>
                    <Text style={dynamicStyles.historyReference}>
                      Factura: {payment.invoice_number}
                    </Text>
                  </View>
                  <View style={dynamicStyles.historyAmountContainer}>
                    <Text style={dynamicStyles.historyAmount}>
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </Text>
                    <View style={[dynamicStyles.statusBadge, { backgroundColor: getPaymentStatusColor(payment.state) + '20' }]}>
                      <Text style={[dynamicStyles.statusText, { color: getPaymentStatusColor(payment.state) }]}>
                        {getPaymentStatusText(payment.state)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={dynamicStyles.emptyContainer}>
                <Text style={dynamicStyles.emptyText}>No hay pagos registrados</Text>
              </View>
            )}
            <View style={dynamicStyles.cardActions}>
              <Button
                title="Ver Todo el Historial"
                onPress={() => router.push('/(protected)/home/historial-pagos')}
                size="sm"
              />
            </View>
          </ExpandableCard>

          <ExpandableCard
            title="Facturas"
            style={dynamicStyles.expandableCard}
            icon={
              <AntDesign 
                name="filetext1" 
                size={24} 
                color={theme.colors.primary} 
              />
            }
          >
            {isLoadingInvoices ? (
              <View style={dynamicStyles.loadingContainer}>
                <Text style={dynamicStyles.loadingText}>Cargando facturas...</Text>
              </View>
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <View key={invoice.invoice_id} style={dynamicStyles.historyItem}>
                  <View style={dynamicStyles.historyInfo}>
                    <Text style={dynamicStyles.historyDate}>{invoice.invoice_date}</Text>
                    <Text style={dynamicStyles.historyMethod}>
                      {invoice.invoice_number}
                    </Text>
                    <Text style={dynamicStyles.historyReference}>
                      Vencimiento: {invoice.due_date || 'Sin fecha'}
                    </Text>
                  </View>
                  <View style={dynamicStyles.historyAmountContainer}>
                    <Text style={dynamicStyles.historyAmount}>
                      ${invoice.amount_total.toFixed(2)} {invoice.currency}
                    </Text>
                    <Text style={[dynamicStyles.historyAmount, { fontSize: theme.fontSize.xs, marginTop: 2 }]}>
                      Pendiente: ${invoice.amount_residual.toFixed(2)}
                    </Text>
                    <View style={[dynamicStyles.statusBadge, { backgroundColor: getInvoiceStatusColor(invoice.payment_state) + '20' }]}>
                      <Text style={[dynamicStyles.statusText, { color: getInvoiceStatusColor(invoice.payment_state) }]}>
                        {getInvoiceStatusText(invoice.payment_state)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={dynamicStyles.emptyContainer}>
                <Text style={dynamicStyles.emptyText}>No hay facturas registradas</Text>
              </View>
            )}
            <View style={dynamicStyles.cardActions}>
              <Button
                title={invoices.length > 0 ? "Actualizar Facturas" : "Cargar Facturas"}
                onPress={handleInvoiceConsultation}
                size="sm"
              />
              {invoices.length > 0 && (
                <Button
                  title="Ver Todas las Facturas"
                  onPress={() => router.push('/(protected)/home/historial-facturas')}
                  size="sm"
                  variant="outline"
                />
              )}
            </View>
          </ExpandableCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  expandableCard: {
    padding: theme.spacing.md,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    flexDirection: 'row',
    justifyContent: 'center',
    ...theme.shadows.sm
  },
  headerContent: {
    width: '100%',
    maxWidth: 1000
  },
  pendingAmount: {
    textAlign: "center",
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  contentTitle: {
    textAlign: "center",
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.xs,
  },
  selectText: {
    fontSize: theme.fontSize.xs,
    textTransform: 'uppercase',
    color: theme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center'
  },
  paymentsContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    width: '100%',
    maxWidth: 1000,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardActions: {
    marginTop: theme.spacing.md,
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodType: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  paymentMethodDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  historyMethod: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  historyAmountContainer: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  historyAmount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
  },
  invoiceDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  historyReference: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});