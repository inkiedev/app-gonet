import { Header } from "@/components/layout/header";
import { Select } from "@/components/ui/custom-select";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
interface Account {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  name: string;
  speedMbps: number;
  price: number;
}

interface InternetPlansProps {
  accounts: Account[];
  currentPlan: Plan;
  availablePlans: Plan[];
}

  interface Plan {
    id: string;
    name: string;
    speedMbps: number;
    price: number;
  }

  const accounts: { label: string; value: Plan }[] = [
    {
      label: "p1",
      value: { id: "p2", name: "Fibra 100", speedMbps: 100, price: 19.99 }
    },
    {
      label: "p3",
      value: { id: "p3", name: "Fibra 500", speedMbps: 500, price: 39.99 }
    },
    {
      label: "p4",
      value: { id: "p4", name: "Fibra 1000", speedMbps: 1000, price: 59.99 }
    },
  ];

  const currentPlan = {
    id: "p1",
    name: "Fibra Plus",
    speedMbps: 300,
    price: 29.99,
  };

  const availablePlans = [
    { id: "p2", name: "Fibra 100", speedMbps: 100, price: 19.99 },
    { id: "p3", name: "Fibra 500", speedMbps: 500, price: 39.99 },
    { id: "p4", name: "Fibra 1000", speedMbps: 1000, price: 59.99 },
  ];


export default function InternetPlans() {
  const [selectedAccount, setSelectedAccount] = useState<Plan>();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
              title="Mi Plan"
              leftAction={{
                icon: "arrow-back",
                onPress: handleGoBack,
              }}
              variant="default"
            />

      {/* HEADER FIJO */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tu plan actual</Text>
        <Text style={styles.planName}>{currentPlan.name}</Text>
        <Text style={styles.planDetails}>
          {currentPlan.speedMbps} Mbps — ${currentPlan.price.toFixed(2)}
        </Text>

        <Select
          options={accounts}
          value={selectedAccount}
          onValueChange={(value, index) => setSelectedAccount(value)}
          renderItem={(option, index, isSelected) => {
            return (
              <View>
                <Text>{option.value.id}</Text>
                <Text style={[styles.accountButtonText]}>{option.value.name}</Text>
                <Text>{option.value.speedMbps} Mbps — ${option.value.price.toFixed(2)}</Text>
              </View>
            );
          }}
          variant="outline"
          size="md"
        />
      </View>

      {/* SCROLL DE PLANES */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {availablePlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planDetails}>
              {plan.speedMbps} Mbps — ${plan.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  planName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  planDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  accountSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  accountButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.border.light,
  },
  accountButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  accountButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
  },
  accountButtonTextActive: {
    color: theme.colors.text.inverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  planCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
});
