import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import { Select } from "@/components/ui/custom-select";
import Text from "@/components/ui/custom-text";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { useTheme } from "@/contexts/theme-context";
import { RootState } from '@/store';
import { Subscription } from '@/types/subscription';
import { AntDesign, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
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

const paymentHistory: PaymentHistory[] = [
  {
    id: "1",
    date: "2024-01-15",
    amount: 29.90,
    status: 'completed',
    method: "Tarjeta de Credito"
  },
  {
    id: "2", 
    date: "2024-01-10",
    amount: 45.50,
    status: 'completed',
    method: "Transferencia Bancaria"
  },
  {
    id: "3",
    date: "2024-01-05",
    amount: 29.90,
    status: 'pending',
    method: "PayPal"
  }
];

export default function PaymentsScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const router = useRouter();
  
  const { subscriptions, currentAccount } = useSelector((state: RootState) => ({
    subscriptions: state.auth.subscriptions,
    currentAccount: state.auth.currentAccount
  }));

  const [selectedAccount, setSelectedAccount] = useState<Subscription | undefined>(currentAccount || undefined);

  const handleGoBack = () => {
    router.back();
  };

  
const handlePaymentPress = async () => {
    try {
      await console.log(selectedAccount)
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

  const handleInvoiceConsultation = () => {
    console.log('Navegando a consulta de facturas');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.colors.success || '#10B981';
      case 'pending': return theme.colors.warning || '#F59E0B';
      case 'failed': return theme.colors.error;
      default: return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallido';
      default: return status;
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
            {paymentHistory.map((payment) => (
              <View key={payment.id} style={dynamicStyles.historyItem}>
                <View style={dynamicStyles.historyInfo}>
                  <Text style={dynamicStyles.historyDate}>{payment.date}</Text>
                  <Text style={dynamicStyles.historyMethod}>{payment.method}</Text>
                </View>
                <View style={dynamicStyles.historyAmountContainer}>
                  <Text style={dynamicStyles.historyAmount}>${payment.amount.toFixed(2)}</Text>
                  <View style={[dynamicStyles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                    <Text style={[dynamicStyles.statusText, { color: getStatusColor(payment.status) }]}>
                      {getStatusText(payment.status)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <View style={dynamicStyles.cardActions}>
              <Button
                title="Ver Todo el Historial"
                onPress={() => console.log('Ver historial completo')}
                size="sm"
              />
            </View>
          </ExpandableCard>

          <TouchableOpacity
            onPress={handleInvoiceConsultation}
            activeOpacity={0.8}
          >
            <Card>
              <View style={dynamicStyles.cardHeader}>
                <View style={dynamicStyles.cardTitleContainer}>
                  <AntDesign 
                    name="filetext1" 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                  <Text style={dynamicStyles.cardTitle}>Consulta de Facturas</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </View>
              <Text style={dynamicStyles.invoiceDescription}>
                Consulta y descarga tus facturas pendientes y pagadas
              </Text>
            </Card>
          </TouchableOpacity>
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
    fontSize: theme.fontSize.sm,
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
});