import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import Text from "@/components/ui/custom-text";
import { useTheme } from "@/contexts/theme-context";
import { apiService, Invoice, InvoicesResponse } from '@/services/api';
import { RootState } from '@/store';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { createSelector } from '@reduxjs/toolkit';
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from 'react-redux';

const selectAuthData = createSelector(
  (state: RootState) => state.auth.currentAccount,
  (currentAccount) => ({
    currentAccount,
  })
);

export default function HistorialFacturasScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const router = useRouter();
  
  const { currentAccount } = useSelector(selectAuthData);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentAccount?.partner_invoice?.id) {
      loadAllInvoices();
    }
  }, [currentAccount]);

  const loadAllInvoices = async (isRefresh = false) => {
    if (!currentAccount?.partner_invoice?.id) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response: InvoicesResponse = await apiService.getInvoicesByPartner(
        'enterprise',
        currentAccount.partner_invoice.id
        // Sin límite para mostrar todas
      );
      
      if (response.success) {
        setInvoices(response.invoices);
      }
    } catch (error) {
      console.error('Error loading all invoices:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
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

  const handleGoBack = () => {
    router.back();
  };

  const onRefresh = () => {
    loadAllInvoices(true);
  };

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <Card style={dynamicStyles.invoiceCard}>
      <View style={dynamicStyles.invoiceHeader}>
        <View style={dynamicStyles.invoiceInfo}>
          <View style={dynamicStyles.invoiceNumberContainer}>
            <AntDesign 
              name="filetext1" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={dynamicStyles.invoiceNumber}>{item.invoice_number}</Text>
          </View>
          <Text style={dynamicStyles.invoiceDate}>
            Fecha: {item.invoice_date}
          </Text>
          {item.due_date && (
            <Text style={dynamicStyles.invoiceDueDate}>
              Vencimiento: {item.due_date}
            </Text>
          )}
          {item.reference && (
            <Text style={dynamicStyles.invoiceReference}>
              Ref: {item.reference}
            </Text>
          )}
        </View>
        <View style={dynamicStyles.invoiceAmountContainer}>
          <Text style={dynamicStyles.invoiceAmount}>
            ${item.amount_total.toFixed(2)}
          </Text>
          <Text style={dynamicStyles.invoiceCurrency}>
            {item.currency}
          </Text>
          {item.amount_residual > 0 && (
            <Text style={dynamicStyles.invoiceResidual}>
              Pendiente: ${item.amount_residual.toFixed(2)}
            </Text>
          )}
          <View style={[
            dynamicStyles.statusBadge, 
            { backgroundColor: getInvoiceStatusColor(item.payment_state) + '20' }
          ]}>
            <Text style={[
              dynamicStyles.statusText, 
              { color: getInvoiceStatusColor(item.payment_state) }
            ]}>
              {getInvoiceStatusText(item.payment_state)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyContainer}>
      <AntDesign 
        name="filetext1" 
        size={64} 
        color={theme.colors.text.secondary} 
        style={dynamicStyles.emptyIcon}
      />
      <Text style={dynamicStyles.emptyTitle}>No hay facturas</Text>
      <Text style={dynamicStyles.emptyText}>
        No se encontraron facturas para esta cuenta
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={dynamicStyles.loadingText}>Cargando facturas...</Text>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
      <Header
        title="Historial de Facturas"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />

      {isLoading && invoices.length === 0 ? (
        renderLoadingState()
      ) : (
        <FlatList
          data={invoices}
          renderItem={renderInvoiceItem}
          keyExtractor={(item) => item.invoice_id.toString()}
          contentContainerStyle={[
            dynamicStyles.listContainer,
            invoices.length === 0 && dynamicStyles.emptyListContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  invoiceCard: {
    padding: theme.spacing.md,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  invoiceNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  invoiceNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  invoiceDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  invoiceDueDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  invoiceReference: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  invoiceAmountContainer: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  invoiceAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  invoiceCurrency: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  invoiceResidual: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    fontWeight: theme.fontWeight.medium,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
});