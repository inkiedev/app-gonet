import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import Text from "@/components/ui/custom-text";
import { useTheme } from "@/contexts/theme-context";
import { apiService, Payment, PaymentsResponse } from '@/services/api';
import { RootState } from '@/store';
import { Ionicons } from "@expo/vector-icons";
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

export default function HistorialPagosScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const router = useRouter();
  
  const { currentAccount } = useSelector(selectAuthData);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentAccount?.partner_invoice?.id) {
      loadAllPayments();
    }
  }, [currentAccount]);

  const loadAllPayments = async (isRefresh = false) => {
    if (!currentAccount?.partner_invoice?.id) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response: PaymentsResponse = await apiService.getPaymentsByInvoicePartner(
        'enterprise',
        currentAccount.partner_invoice.id
        // Sin límite para mostrar todos
      );
      
      if (response.success) {
        setPayments(response.payments);
      }
    } catch (error) {
      console.error('Error loading all payments:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
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

  const handleGoBack = () => {
    router.back();
  };

  const onRefresh = () => {
    loadAllPayments(true);
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Card style={dynamicStyles.paymentCard}>
      <View style={dynamicStyles.paymentHeader}>
        <View style={dynamicStyles.paymentInfo}>
          <Text style={dynamicStyles.paymentDate}>{item.payment_date}</Text>
          <Text style={dynamicStyles.paymentMethod}>{item.payment_method}</Text>
          <Text style={dynamicStyles.paymentReference}>
            Factura: {item.invoice_number}
          </Text>
          {item.reference && (
            <Text style={dynamicStyles.paymentReference}>
              Ref: {item.reference}
            </Text>
          )}
        </View>
        <View style={dynamicStyles.paymentAmountContainer}>
          <Text style={dynamicStyles.paymentAmount}>
            ${item.amount.toFixed(2)} {item.currency}
          </Text>
          <View style={[
            dynamicStyles.statusBadge, 
            { backgroundColor: getPaymentStatusColor(item.state) + '20' }
          ]}>
            <Text style={[
              dynamicStyles.statusText, 
              { color: getPaymentStatusColor(item.state) }
            ]}>
              {getPaymentStatusText(item.state)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyContainer}>
      <Ionicons 
        name="receipt-outline" 
        size={64} 
        color={theme.colors.text.secondary} 
        style={dynamicStyles.emptyIcon}
      />
      <Text style={dynamicStyles.emptyTitle}>No hay pagos</Text>
      <Text style={dynamicStyles.emptyText}>
        No se encontraron pagos para esta cuenta
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={dynamicStyles.loadingText}>Cargando historial...</Text>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
      <Header
        title="Historial de Pagos"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />

      {isLoading && payments.length === 0 ? (
        renderLoadingState()
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.payment_id.toString()}
          contentContainerStyle={[
            dynamicStyles.listContainer,
            payments.length === 0 && dynamicStyles.emptyListContainer
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
  paymentCard: {
    padding: theme.spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  paymentDate: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  paymentMethod: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  paymentReference: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  paymentAmountContainer: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  paymentAmount: {
    fontSize: theme.fontSize.lg,
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