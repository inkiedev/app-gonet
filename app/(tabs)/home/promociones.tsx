import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import React from "react";
import Back from '@/assets/images/iconos gonet back.svg';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CedulaScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: () => router.back(),
        }}
        title="Promociones"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de información */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>    
            Refiere y gana
          </Text>
          <Text style={styles.infoText}>
            ¡REFIERE Y GANA! Refiere a un amigo/a o famiiliar y recibe el 100% de descuento en tu siguiente factura
          </Text>
        </Card>

        {/* Botones */}
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            title="Establecimientos"
            onPress={() => console.log("Establecimientos")}
          />
          <Button
            style={styles.button}
            title="Historial"
            onPress={() => console.log("Historial")}
          />
        </View>

        {/* Imagen */}
        <Text style={styles.subtitle}>Promociones</Text>
        <Image
          source={require("@/assets/images/gonetPublicidad1.webp")}
          style={styles.image}
          resizeMode={Platform.OS == 'web'? 'contain':"cover"}
          
        />

        {/* Card adicional */}
        <Text style={styles.sectionTitle}>Wifi Total</Text>
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            ¿Buscas mejorar la conectividad de tu hogar? Agrega WIFI TOTAL a tu
            plan y recibe 2 routers WiFi 6 de última tecnología. ¡Llega a todos
            los rincones de tu hogar con una sola red de internet por tan solo
            $4,50 + imp!
          </Text>
        </Card>

       
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  infoCard: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  infoText: {
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.sm,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl,
    width: "100%",
  },
  button: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.contrast,
    alignSelf: "center",
  },


    subtitle: {
        marginTop: theme.spacing.lg,
        fontSize: theme.fontSize.lg,
        fontWeight: "500",
        color: theme.colors.primaryDark,
        alignSelf: "center",
    },
  image: {
    width:'100%',
    backgroundPosition: 'center',
   
    
    marginTop:theme.spacing.lg,
    marginBottom:theme.spacing.lg,
    
  },
});
