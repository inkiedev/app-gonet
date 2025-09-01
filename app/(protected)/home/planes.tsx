import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/custom-button";
import { Select, SelectOption } from "@/components/ui/custom-select";
import { PlanCard } from "@/components/ui/plan-card";
import { theme } from "@/styles/theme";
import { Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Back from '@/assets/images/iconos gonet back.svg';
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

interface Account {
  id: string;
  name: string;
  address: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  details: string[];
}

const accounts: SelectOption<Account>[] = [
  {
    value: { id: "800030", name: "GoEssencial 250Mbps", address: "Av Paseo de los Cañaris y Yanaurco" }
  },
  {
    value: { id: "800040", name: "GoPlus 450Mbps", address: "Av Gonzales Suarez y Max Uhle" }
  },
  {
    value: { id: "800050", name: "Fibra 1000", address: "Av de la Prensa y Av. 10 de Agosto" }
  },
];

const currentPlan = {
  speedMbps: 250,
};

export const availablePlans: Plan[] = [
  { 
    id: "p1", 
    name: "GoEssencial 300 Mbps", 
    price: 19.90, 
    finalPrice: 22.89, 
    details: [
      'Hasta 100 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  },
  {
    id: "p2",
    name: "GoPlus 450 Mbps",
    price: 29.90,
    finalPrice: 34.89,
    details: [
      'Hasta 200 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  },
  {
    id: "p3",
    name: "GoPlus 500 Mbps",
    price: 39.90,
    finalPrice: 45.89,
    details: [
      'Hasta 500 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  },
  {
    id: "p4",
    name: "GoConnect 700 Mbps",
    price: 59.90,
    finalPrice: 69.89,
    details: [
      'Hasta 1000 Mbps de velocidad',
      'Instalación gratuita',
      'Router Wi-Fi incluido'
    ]
  }
];


export default function InternetPlans() {
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Mi Plan"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />

      <View style={styles.header}>
        <Text style={styles.contentTitle}>Plan actual</Text>
        <Text style={styles.currentSpeed}>
          Velocidad: {currentPlan.speedMbps} Mbps
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
          variant="outline"
          size="md"
          leftIcon={<Foundation name="info" size={24} color="black" />}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Text style={styles.contentTitle}>Actualizar Plan</Text>
        {availablePlans.map((plan) => (
          <PlanCard title={plan.name} key={plan.id}>
            <View style={styles.planContainer}>
              <Text style={styles.planPrice}>Precio: ${plan.price}+imp</Text>
              <Text style={styles.planFinalPrice}>Precio final: {plan.finalPrice}</Text>
              <View style={styles.planDetails}>
                {
                  plan.details.map((detail, index) => (
                    <Text key={index} style={styles.planDetail}>{`\u2022 ${detail}`}</Text>
                  ))
                }
              </View>
              <Button title="Actualizar" onPress={() => {}} />
            </View>
          </PlanCard>
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
  currentSpeed: {
    textAlign: "center",
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.sm,
  },
  contentTitle: {
    textAlign: "center",
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  planContainer: {
    paddingHorizontal: theme.spacing.sm,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    alignItems: 'center'
  },
  planName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  planPrice: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  planFinalPrice: {
    fontSize: theme.fontSize.md,
  },
  planDetails: {
    width: '100%',
    marginVertical: theme.spacing.xs,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  planDetail: {
    fontSize: theme.fontSize.md,
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
  selectText: {
    fontSize: theme.fontSize.sm,
    textTransform: 'uppercase'
  },
  updateButton: {

  }
});
