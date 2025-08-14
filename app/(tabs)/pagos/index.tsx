import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/custom-button";
import { Select, SelectOption } from "@/components/ui/custom-select";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { theme } from "@/styles/theme";
import { AntDesign, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Account {
  id: string;
  name: string;
  address: string;
  pendingAmount: number;
}

interface PaymentMethod {
  id: string;
  type: string;
  details: string;
  isDefault: boolean;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const accounts: SelectOption<Account>[] = [
  {
    value: { 
      id: "800030", 
      name: "GoEssencial 250Mbps", 
      address: "Av Paseo de los Cañaris y Yanaurco",
      pendingAmount: 29.90
    }
  },
  {
    value: { 
      id: "800040", 
      name: "GoPlus 450Mbps", 
      address: "Av Gonzales Suarez y Max Uhle",
      pendingAmount: 45.50
    }
  },
  {
    value: { 
      id: "800050", 
      name: "Fibra 1000", 
      address: "Av de la Prensa y Av. 10 de Agosto",
      pendingAmount: 0.00
    }
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "Tarjeta de Cr�dito",
    details: "**** **** **** 1234",
    isDefault: true
  },
  {
    id: "2", 
    type: "Transferencia Bancaria",
    details: "Banco Pichincha - Cuenta ****5678",
    isDefault: false
  },
  {
    id: "3",
    type: "PayPal",
    details: "usuario@email.com",
    isDefault: false
  }
];

const paymentHistory: PaymentHistory[] = [
  {
    id: "1",
    date: "2024-01-15",
    amount: 29.90,
    status: 'completed',
    method: "Tarjeta de Cr�dito"
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

export default function Payments() {
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Pagos"
        leftAction={{
          icon: "arrow-back",
          onPress: handleGoBack,
        }}
        variant="default"
      />

      <View style={styles.header}>
        <Text style={styles.contentTitle}>Valor Pendiente</Text>
        <Text style={styles.pendingAmount}>
          ${selectedAccount ? selectedAccount.pendingAmount.toFixed(2) : "0.00"}
        </Text>

        <Select
          options={accounts}
          value={selectedAccount}
          onValueChange={(value, index) => setSelectedAccount(value)}
          renderItem={(option, index, isSelected) => {
            return (
              <View>
                <Text style={styles.selectText}># {option.value.id}</Text>
                <Text style={styles.selectText}>{option.value.name}</Text>
                <Text style={styles.selectText}>{option.value.address}</Text>
              </View>
            );
          }}
          variant="default"
          size="md"
          leftIcon={<Foundation name="info" size={24} />}
          placeholder="Selecciona una cuenta"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <ExpandableCard
          title="Métodos de Pago"
          style={styles.expandableCard}
          icon={
            <MaterialIcons 
              name="payment" 
              size={24} 
              color={theme.colors.primary} 
            />
          }
        >
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodItem}>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodType}>{method.type}</Text>
                <Text style={styles.paymentMethodDetails}>{method.details}</Text>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Por defecto</Text>
                </View>
              )}
            </View>
          ))}
          <View style={styles.cardActions}>
            <Button
              title="Agregar Método"
              onPress={() => console.log('Agregar método')}
              variant="outline"
              size="sm"
            />
          </View>
        </ExpandableCard>

        <ExpandableCard
          title="Historial de Pagos"
          style={styles.expandableCard}
          icon={
            <Ionicons 
              name="time-outline" 
              size={24} 
              color={theme.colors.primary} 
            />
          }
        >
          {paymentHistory.map((payment) => (
            <View key={payment.id} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDate}>{payment.date}</Text>
                <Text style={styles.historyMethod}>{payment.method}</Text>
              </View>
              <View style={styles.historyAmountContainer}>
                <Text style={styles.historyAmount}>${payment.amount.toFixed(2)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                    {getStatusText(payment.status)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.cardActions}>
            <Button
              title="Ver Todo el Historial"
              onPress={() => console.log('Ver historial completo')}
              variant="outline"
              size="sm"
            />
          </View>
        </ExpandableCard>

        <TouchableOpacity
          style={styles.invoiceCard}
          onPress={handleInvoiceConsultation}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <AntDesign 
                name="filetext1" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={styles.cardTitle}>Consulta de Facturas</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.secondary}
            />
          </View>
          <Text style={styles.invoiceDescription}>
            Consulta y descarga tus facturas pendientes y pagadas
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  expandableCard: {
    padding: theme.spacing.md,
    paddingBottom: 0
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
    ...theme.shadows.sm,
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
    padding: theme.spacing.md,
    gap: theme.spacing.md,
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
  invoiceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    ...theme.shadows.sm,
  },
  invoiceDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});